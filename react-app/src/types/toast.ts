import { NotificationKind, NotificationType } from "carbon-components-react";

export interface Toast {
    title?: string;
    subtitle: string;
    caption?: string;
    kind?: NotificationKind;
    notificationType?: NotificationType;
    onClose?: (evt: React.MouseEvent<HTMLButtonElement>) => boolean;
}