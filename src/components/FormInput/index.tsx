import { Input } from 'antd'
import type { InputProps } from 'antd'
import type { ReactNode, ComponentProps } from 'react'
import { useId } from 'react'
import './index.css'

interface FormInputProps extends InputProps {
  prefixIcon?: ReactNode
  label?: ReactNode
}

const FormInput = ({ prefixIcon, label, className = '', id, ...props }: FormInputProps) => {
  const generatedId = useId()
  const inputId = id || generatedId

  const inputElement = (
    <div className="form-input-wrapper">
      {prefixIcon && (
        <div className="form-input-icon">
          {prefixIcon}
        </div>
      )}
      <Input
        {...props}
        id={inputId}
        className={`form-input ${prefixIcon ? 'form-input-with-icon' : ''} ${className}`}
      />
    </div>
  )

  if (label) {
    return (
      <div className="form-field">
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
        {inputElement}
      </div>
    )
  }

  return inputElement
}

interface FormInputPasswordProps extends ComponentProps<typeof Input.Password> {
  prefixIcon?: ReactNode
  label?: ReactNode
}

const FormInputPassword = ({ prefixIcon, label, className = '', id, ...props }: FormInputPasswordProps) => {
  const generatedId = useId()
  const inputId = id || generatedId

  const inputElement = (
    <div className="form-input-wrapper">
      {prefixIcon && (
        <div className="form-input-icon">
          {prefixIcon}
        </div>
      )}
      <Input.Password
        {...props}
        id={inputId}
        className={`form-input ${prefixIcon ? 'form-input-with-icon' : ''} ${className}`}
      />
    </div>
  )

  if (label) {
    return (
      <div className="form-field">
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
        {inputElement}
      </div>
    )
  }

  return inputElement
}

interface FormInputSearchProps extends ComponentProps<typeof Input.Search> {
  prefixIcon?: ReactNode
  label?: ReactNode
}

const FormInputSearch = ({ prefixIcon, label, className = '', id, ...props }: FormInputSearchProps) => {
  const generatedId = useId()
  const inputId = id || generatedId

  const inputElement = (
    <div className="form-input-wrapper">
      {prefixIcon && (
        <div className="form-input-icon">
          {prefixIcon}
        </div>
      )}
      <Input.Search
        {...props}
        id={inputId}
        className={`form-input ${prefixIcon ? 'form-input-with-icon' : ''} ${className}`}
      />
    </div>
  )

  if (label) {
    return (
      <div className="form-field">
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
        {inputElement}
      </div>
    )
  }

  return inputElement
}

interface FormInputTextAreaProps extends ComponentProps<typeof Input.TextArea> {
  prefixIcon?: ReactNode
  label?: ReactNode
}

const FormInputTextArea = ({ prefixIcon, label, className = '', id, ...props }: FormInputTextAreaProps) => {
  const generatedId = useId()
  const inputId = id || generatedId

  const inputElement = (
    <div className="form-input-wrapper">
      {prefixIcon && (
        <div className="form-input-icon">
          {prefixIcon}
        </div>
      )}
      <Input.TextArea
        {...props}
        id={inputId}
        className={`form-input ${prefixIcon ? 'form-input-with-icon' : ''} ${className}`}
      />
    </div>
  )

  if (label) {
    return (
      <div className="form-field">
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
        {inputElement}
      </div>
    )
  }

  return inputElement
}

interface FormInputButtonProps extends InputProps {
  prefixIcon?: ReactNode
  label?: ReactNode
  button: ReactNode
}

const FormInputButton = ({ prefixIcon, label, button, className = '', id, ...props }: FormInputButtonProps) => {
  const generatedId = useId()
  const inputId = id || generatedId

  const inputElement = (
    <div className="form-input-button-group">
      <div className="form-input-wrapper form-input-wrapper-flex">
        {prefixIcon && (
          <div className="form-input-icon">
            {prefixIcon}
          </div>
        )}
        <Input
          {...props}
          id={inputId}
          className={`form-input ${prefixIcon ? 'form-input-with-icon' : ''} ${className}`}
        />
      </div>
      {button}
    </div>
  )

  if (label) {
    return (
      <div className="form-field">
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
        {inputElement}
      </div>
    )
  }

  return inputElement
}

FormInput.Password = FormInputPassword
FormInput.Search = FormInputSearch
FormInput.TextArea = FormInputTextArea
FormInput.Button = FormInputButton

export default FormInput
