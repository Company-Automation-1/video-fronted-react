import FormInput from '@/components/FormInput'
import { IconLock, IconUser } from '@/components/Icons'

const Dev = () => {
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <FormInput
                label="Username or Email"
                prefixIcon={<IconUser />}
                placeholder="john.doe"
            />
            <FormInput.Password
                label="Password"
                prefixIcon={<IconLock />}
                placeholder="••••••••"
            />
        </div>
    )
}

export default Dev