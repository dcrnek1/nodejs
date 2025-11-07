import { Toaster as Sonner } from "sonner"
import { InfoIcon, CheckCircleIcon, WarningIcon, XCircleIcon, CircleNotchIcon } from "@phosphor-icons/react"

const Toaster = ({ ...props }) => {

    return (
        <Sonner
            icons={{
                success: <CheckCircleIcon weight="duotone" size={21} className="text-success" />,
                info: <InfoIcon weight="duotone" size={20} className="text-info" />,
                warning: <WarningIcon weight="duotone" size={20} className="text-warning" />,
                error: <XCircleIcon weight="duotone" size={20} className="text-error" />,
                loading: <CircleNotchIcon size={20} className="animate-spin" />,
            }}
            {...props}
        />
    )
}

export { Toaster }
