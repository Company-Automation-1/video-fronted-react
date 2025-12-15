import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form } from 'antd'
import { useAuthStore } from '@/store'
import { useMessage } from '@/hooks'
import { Header } from '@/components'
import { IconUser, IconMail, IconLock, IconKey, IconArrowRight, IconLoader } from '@/components/Icons'
import FormInput from '@/components/FormInput'
import { login, register, sendCode } from '@/server/user'
import './index.css'

type AuthMode = 'login' | 'register'

interface LoginForm {
  username: string
  password: string
}

interface RegisterForm {
  username: string
  email: string
  password: string
  verificationCode: string
}

const Login = () => {
  const [mode, setMode] = useState<AuthMode>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [codeTimer, setCodeTimer] = useState(0)
  const [form] = Form.useForm()

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { token, setToken } = useAuthStore()
  const messageApi = useMessage()

  // 如果已登录，重定向到目标页面或首页
  useEffect(() => {
    if (token) {
      const redirect = searchParams.get('redirect') || '/'
      navigate(decodeURIComponent(redirect), { replace: true })
    }
  }, [token, navigate, searchParams])

  // Timer logic for verification code
  useEffect(() => {
    let interval: number
    if (codeTimer > 0) {
      interval = window.setInterval(() => {
        setCodeTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [codeTimer])

  const handleSendCode = async () => {
    try {
      await form.validateFields(['email'])
      const email = form.getFieldValue('email')
      await sendCode({ email })
      messageApi.success('验证码已发送')
      setCodeTimer(60)
    } catch {
      // 表单验证错误由 antd Form 自动显示
      // API 错误由全局拦截器处理
    }
  }

  const onFinish = async (values: LoginForm | RegisterForm) => {
    setIsLoading(true)

    try {
      if (mode === 'login') {
        const loginValues = values as LoginForm
        const response = await login(loginValues)
        if (response.data) {
          setToken(response.data.access_token)
          messageApi.success('登录成功')
          const redirect = searchParams.get('redirect')
          navigate(redirect ? decodeURIComponent(redirect) : '/', { replace: true })
        }
      } else {
        const registerValues = values as RegisterForm
        await register(registerValues)
        messageApi.success('注册成功，请登录')
        setMode('login')
        form.resetFields()
      }
    } catch {
      // 错误已由全局拦截器处理，这里只需要确保 loading 状态正确
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    form.resetFields()
  }

  return (
    <div className="login-page">
      <Header />
      <div className="login-background">
        <div className="login-gradient login-gradient-1"></div>
        <div className="login-gradient login-gradient-2"></div>
      </div>

      <div className="login-container">
        <div className="login-content">
          {/* Toggle Header */}
          <div className="login-toggle">
            <div 
              className={`login-toggle-slider ${mode === 'login' ? 'login-toggle-slider-left' : 'login-toggle-slider-right'}`}
            ></div>
            <button 
              onClick={() => setMode('login')}
              className={`login-toggle-button ${mode === 'login' ? 'login-toggle-active' : ''}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setMode('register')}
              className={`login-toggle-button ${mode === 'register' ? 'login-toggle-active' : ''}`}
            >
              Register
            </button>
          </div>

          {/* Glass Card Form */}
          <div className="login-card">
            <div className="login-card-header">
              <h2 className="login-title">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="login-subtitle">
                {mode === 'login' 
                  ? 'Enter your credentials to access your dashboard.' 
                  : 'Join Nova Portal to experience the future.'}
              </p>
            </div>

            <Form
              form={form}
              onFinish={onFinish}
              className="login-form"
              layout="vertical"
            >
              {/* Username Input */}
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
                style={{ marginBottom: 0 }}
              >
                <FormInput
                  label={mode === 'login' ? 'Username or Email' : 'Username'}
                  prefixIcon={<IconUser />}
                  placeholder={mode === 'login' ? "john.doe" : "Choose a username"}
                />
              </Form.Item>

              {/* Register: Email Input */}
              {mode === 'register' && (
                <div className="login-field-enter">
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: '请输入邮箱地址' },
                      { type: 'email', message: '请输入有效的邮箱地址' }
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <FormInput
                      label="Email Address"
                      prefixIcon={<IconMail />}
                      type="email"
                      placeholder="john@example.com"
                    />
                  </Form.Item>
                </div>
              )}

              {/* Register: Verification Code */}
              {mode === 'register' && (
                <div className="login-field-enter">
                  <Form.Item
                    name="verificationCode"
                    rules={[{ required: true, message: '请输入验证码' }]}
                    style={{ marginBottom: 0 }}
                  >
                    <FormInput.Button
                      label="Verification Code"
                      prefixIcon={<IconKey />}
                      placeholder="123456"
                      button={
                        <button
                          type="button"
                          disabled={codeTimer > 0}
                          onClick={handleSendCode}
                          className="login-code-button"
                        >
                          {codeTimer > 0 ? `${codeTimer}s` : 'Send Code'}
                        </button>
                      }
                    />
                  </Form.Item>
                </div>
              )}

              {/* Password Input */}
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
                style={{ marginBottom: 0 }}
              >
                <FormInput.Password
                  label="Password"
                  prefixIcon={<IconLock />}
                  placeholder="••••••••"
                />
              </Form.Item>

              {/* Submit Button */}
              <Form.Item style={{ marginBottom: 0 }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="login-submit-button"
                >
                  {isLoading ? (
                    <IconLoader className="login-loader" />
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                      <IconArrowRight className="login-submit-icon" />
                    </>
                  )}
                </button>
              </Form.Item>
            </Form>
          </div>

          {/* Footer Link */}
          <p className="login-footer">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={toggleMode}
              className="login-footer-link"
            >
              {mode === 'login' ? 'Register now' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
