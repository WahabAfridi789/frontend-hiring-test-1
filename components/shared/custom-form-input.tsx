/* eslint-disable no-unused-vars */

import { Eye, EyeOff } from "lucide-react";
import { Control } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState } from "react";

export enum FormFieldType {
    INPUT = "input",
    TEXTAREA = "textarea",
    PASSWORD_INPUT = "password",
}

interface CustomProps {
    control: Control<any>;
    name: string;
    label?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    iconAlt?: string;
    disabled?: boolean;
    readOnly?: boolean;
    children?: React.ReactNode;
    fieldType: FormFieldType;
    className?: string;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    switch (props.fieldType) {
        case FormFieldType.INPUT:
            return (
                <>
                    <FormControl>
                        <div className="relative">

                            <Input
                                placeholder={props.placeholder}
                                {...field}
                                className={cn(
                                    "w-full  relative font-avenir  p-5 my-2 rounded-lg ",
                                    props.className, props.icon && "pl-10"
                                )}
                            />

                            {(
                                <div className="absolute  top-3 left-3 ">
                                    {props.icon}
                                </div>
                            )}
                        </div>
                    </FormControl>
                </>
            );


        case FormFieldType.PASSWORD_INPUT:
            return (
                <FormControl>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={props.placeholder}
                            {...field}
                            className={cn(
                                "w-full    p-5 my-2 rounded-lg ",
                                props.className, props.icon && "pl-10"
                            )}
                        />
                        {(
                            <>
                                {props.icon && (
                                    <div className="absolute  top-3 left-3  ">
                                        {props.icon}
                                    </div>
                                )}

                                {showPassword ? (
                                    <EyeOff
                                        size={20}
                                        onClick={togglePasswordVisibility}
                                        className="absolute top-1 right-2 mt-2 mr-2 cursor-pointer   "
                                    />
                                ) : (
                                    <Eye
                                        size={20}
                                        onClick={togglePasswordVisibility}
                                        className="absolute top-1 right-2 cursor-pointer mt-2 mr-2   "
                                    />
                                )}
                            </>
                        )}
                    </div>
                </FormControl>
            );

        case FormFieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea
                        placeholder={props.placeholder}
                        {...field}
                        className="shad-textArea"
                        disabled={props.disabled}
                    />
                </FormControl>
            );
        default:
            return null;
    }
};

export const CustomFormField = (props: CustomProps) => {
    const { control, name, label } = props;

    return (
        <FormField
            control={control}
            name={name}
            disabled={props.disabled}
            render={({ field }) => (
                <FormItem className="flex-1 w-full">
                    {props.fieldType && label && (
                        <FormLabel className="shad-input-label relative">{label}
                            <span className="absolute -top-2 -left-2 mt-2 mr-2 text-red-400">
                                *
                            </span>
                        </FormLabel>
                    )}
                    <RenderInput field={field} props={props} />

                    <FormMessage className="mt-1 ml-2" />
                </FormItem>
            )}
        />
    );
};

