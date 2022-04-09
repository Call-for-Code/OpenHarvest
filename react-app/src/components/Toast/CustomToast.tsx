import { Toast } from "../../types/toast";
import React, { Component } from "react";
import { ToastNotification } from "carbon-components-react";
import { MESSAGES } from "../../helpers/messages";
import "./CustomToast.scss";

type CustomToastProps = {
    toast?: Toast;
};

export class CustomToast extends Component<CustomToastProps, any> {

    private readonly toastLife = 5000;

    constructor(props: CustomToastProps) {
        super(props);

        this.getDefaultTitle = this.getDefaultTitle.bind(this);
    }

    getDefaultTitle(): string {
        switch (this.props.toast?.kind) {
            case "error":
                return MESSAGES.ERROR;
            case "success":
                return MESSAGES.SUCCESS;
            case "info":
                return MESSAGES.INFO;
            case "warning":
                return MESSAGES.WARNING;
            default:
                return "";
        }
    }

    render(): JSX.Element {
        return (
            <div className="fixed-toast">
                <ToastNotification
                    title={this.props.toast?.title || this.getDefaultTitle()}
                    subtitle={this.props.toast?.subtitle}
                    caption={this.props.toast?.caption}
                    kind={this.props.toast?.kind}
                    timeout={this.toastLife}
                    notificationType={this.props.toast?.notificationType || "toast"}
                    onClose={this.props.toast?.onClose}
                    lowContrast
                />
            </div>);
    }
}
