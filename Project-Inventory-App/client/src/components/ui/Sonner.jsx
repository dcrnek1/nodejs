import { Toaster as Sonner } from "sonner"
import { InfoIcon, CheckCircleIcon, WarningIcon, XCircleIcon, CircleNotchIcon } from "@phosphor-icons/react"

const Toaster = ({ ...props }) => {

    return (
        <Sonner
            className="text-red"
            icons={{
                success: <CheckCircleIcon size={20} />,
                info: <InfoIcon size={20} />,
                warning: <WarningIcon size={20} />,
                error: <XCircleIcon size={20} />,
                loading: <CircleNotchIcon size={20} className="animate-spin" />,
            }}
            position="top-right"
            {...props}
        />
    )
}

export { Toaster }
