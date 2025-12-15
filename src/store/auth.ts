import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserInfo {
  id?: string
  username?: string
  email?: string
  roles?: string
}

/**
 * 认证状态类型定义及相关操作方法
 * @property token 认证令牌（Token）
 * @property userInfo 当前用户信息
 * 
 * @method setToken 设置认证令牌
 * @method setUserInfo 设置用户信息
 * @method login 登录操作，设置 token 和用户信息
 * @method logout 登出操作，清空认证状态
 * @method updateUserInfo 局部更新用户信息
 * @method reset 重置所有认证状态为初始值
 */
export interface AuthState {
  token: string | null
  userInfo: UserInfo | null

  setToken: (token: string) => void
  setUserInfo: (userInfo: UserInfo) => void
  login: (token: string, userInfo?: UserInfo) => void
  logout: () => void
  updateUserInfo: (partial: Partial<UserInfo>) => void
  reset: () => void
}

/** 认证状态初始值 */
const initialState = {
  token: null,
  userInfo: null,
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      setToken: (token) => set({ token }),

      setUserInfo: (userInfo) => set({ userInfo }),

      login: (token, userInfo) => set({
        token,
        userInfo: userInfo || null,
      }),

      logout: () => set(initialState),

      updateUserInfo: (partial) =>
        set((state) => ({
          userInfo: state.userInfo ? { ...state.userInfo, ...partial } : null
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        userInfo: state.userInfo
      }),
    }
  )
)