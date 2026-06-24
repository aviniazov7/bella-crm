import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { signIn, authErrorMessage } from '../services/auth'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
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
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-ink p-4">
      <Card className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mb-2 text-4xl">💅</div>
          <h1 className="bg-gradient-to-l from-gold to-rose bg-clip-text text-2xl font-bold text-transparent">
            Bella CRM
          </h1>
          <p className="mt-1 text-sm text-rose-soft/80">ניהול מכון יופי</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="אימייל"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email', rules.email)}
          />
          <Input
            label="סיסמה"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password', rules.required)}
          />
          {authError && (
            <p role="alert" className="text-sm text-rose-deep">
              {authError}
            </p>
          )}
          <Button type="submit" className="w-full" loading={loading}>
            התחברות
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default LoginPage
