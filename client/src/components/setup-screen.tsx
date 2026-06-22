import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from "react-image-crop"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/auth-store"
import type { MeResponse } from "@/lib/types"
import { cropImage } from "@/components/setup/setup-image"
import { SetupVerifyCard } from "@/components/setup/setup-verify-card"
import { SetupProfileForm } from "@/components/setup/setup-profile-form"
import { SetupAvatarCropDialog } from "@/components/setup/setup-avatar-crop-dialog"

export function SetupScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const signOut = useAuthStore((state) => state.signOut)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [name, setName] = useState(user?.name ?? "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl ?? null)
  const [avatarSourceFile, setAvatarSourceFile] = useState<File | null>(null)
  const [avatarSourcePreview, setAvatarSourcePreview] = useState<string | null>(null)
  const [cropOpen, setCropOpen] = useState(false)
  const [crop, setCrop] = useState<Crop>({ unit: "%", x: 0, y: 0, width: 80, height: 80 })
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
  const [isCropping, setIsCropping] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard"
  const verified = searchParams.get("verified") === "1"

  useEffect(() => {
    setName(user?.name ?? "")
    setAvatarPreview(user?.avatarUrl ?? null)
  }, [user])

  const initials = useMemo(() => {
    return (name || user?.email || "A")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }, [name, user?.email])

  useEffect(() => {
    if (!avatarSourceFile) {
      setAvatarSourcePreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(avatarSourceFile)
    setAvatarSourcePreview(objectUrl)
    setCompletedCrop(null)
    return () => URL.revokeObjectURL(objectUrl)
  }, [avatarSourceFile])

  function onImageLoad(event: SyntheticEvent<HTMLImageElement>) {
    const { width, height } = event.currentTarget
    imgRef.current = event.currentTarget

    const size = Math.min(width, height) * 0.8

    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "px",
          width: size,
        },
        1,
        width,
        height,
      ),
      width,
      height,
    )
    setCrop(crop)
    setCompletedCrop(crop)
  }

  async function onPickAvatar(file: File | null) {
    if (!file) return
    setAvatarSourceFile(file)
    setCropOpen(true)
  }

  async function onSaveCrop() {
    if (!avatarSourceFile || !completedCrop || !imgRef.current) return

    setIsCropping(true)
    try {
      const croppedFile = await cropImage(imgRef.current, completedCrop, avatarSourceFile.name)
      setAvatarFile(croppedFile)

      const previewUrl = URL.createObjectURL(croppedFile)
      setAvatarPreview(previewUrl)
      setCropOpen(false)
      setAvatarSourceFile(null)
      setAvatarSourcePreview(null)
    } catch (error) {
      toast.error("Could not crop image")
    } finally {
      setIsCropping(false)
    }
  }

  function closeCropDialog() {
    setCropOpen(false)
    setAvatarSourceFile(null)
    setAvatarSourcePreview(null)
    setCompletedCrop(null)
  }

  async function onContinue() {
    if (!user) {
      navigate("/signin", { replace: true })
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      if (avatarFile) {
        formData.append("avatar", avatarFile)
      }

      if (user) {
        await api.patch("/me", formData)
        const meResponse = await api.get<MeResponse>("/me")
        setUser(meResponse.data)
      }

      navigate(redirectTo.startsWith("/") ? redirectTo : "/dashboard", { replace: true })
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Could not complete setup"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return <SetupVerifyCard verified={verified} onSignIn={() => navigate("/signin", { replace: true })} />
  }

  return (
    <>
      <SetupProfileForm
        name={name}
        avatarPreview={avatarPreview}
        initials={initials}
        isSubmitting={isSubmitting}
        onNameChange={setName}
        onPickAvatar={onPickAvatar}
        onContinue={onContinue}
        onSignOut={() => {
          signOut()
          navigate("/signin", { replace: true })
        }}
        showSignOut={Boolean(user)}
        userEmail={user?.email}
      />

      <SetupAvatarCropDialog
        open={cropOpen && Boolean(avatarSourcePreview)}
        imagePreview={avatarSourcePreview}
        crop={crop}
        isSaving={isCropping}
        onOpenChange={setCropOpen}
        onCropChange={setCrop}
        onCropComplete={setCompletedCrop}
        onImageLoad={onImageLoad}
        onCancel={closeCropDialog}
        onSave={onSaveCrop}
      />
    </>
  )
}
