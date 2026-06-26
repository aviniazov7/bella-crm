import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Mail, Lock } from 'lucide-react'
import { signIn, authErrorMessage } from '../services/auth'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { rules } from '../utils/validation'

/** Single-operator email/password login screen. */
export function LoginPage() {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async ({ email, password }) => {
    setAuthError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/')
    } catch (err) {
      setAuthError(authErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir="rtl" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/20 blur-[120px]" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-rose/20 blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-deep/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-glow-lg backdrop-blur-2xl sm:p-10"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 14 }}
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-gradient text-ink shadow-gold"
          >
            <Sparkles className="h-8 w-8" />
          </motion.div>
          <h1 className="font-serif text-4xl font-bold gradient-text">Bella CRM</h1>
          <p className="mt-2 text-sm tracking-wide text-cream/50">ניהול מכון יופי יוקרתי</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="אימייל"
            type="email"
            autoComplete="email"
            placeholder="name@studio.com"
            error={errors.email?.message}
            {...register('email', rules.email)}
          />
          <Input
            label="סיסמה"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', rules.required)}
          />
          {authError && (
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              role="alert"
              className="rounded-lg border border-rose-deep/30 bg-rose-deep/10 px-3 py-2 text-sm text-rose"
            >
              {authError}
            </motion.p>
          )}
          <Button type="submit" loading={loading} size="lg" className="mt-2 w-full">
            כניסה
          </Button>
        </form>
      </motion.div>
    </div>
  )
}

export default LoginPage
