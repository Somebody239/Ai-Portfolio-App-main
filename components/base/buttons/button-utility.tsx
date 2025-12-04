import { Button, ButtonProps } from "./button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonUtilityProps extends ButtonProps {
    icon?: LucideIcon;
    tooltip?: string;
}

export const ButtonUtility = ({ icon: Icon, tooltip, className, ...props }: ButtonUtilityProps) => {
    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn("text-muted-foreground hover:text-foreground", className)}
            title={tooltip}
            {...props}
        >
            {Icon && <Icon className="h-4 w-4" />}
        </Button>
    );
};
