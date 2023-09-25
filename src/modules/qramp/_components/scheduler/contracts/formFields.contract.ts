import { ComputedRef } from 'vue';

interface FieldProps {
    rules?: ((val: any) => boolean | string)[];
    label?: string;
    clearable?: boolean;
    readonly?: boolean;
    hint?: string;
    mask?: string;
    color?: string;
    format24h?: boolean;
    multiple?: boolean;
    options?: { label: string; value: any }[];
    maxlength?: number;
    type?: string;
    'place-holder'?: string;
    alphabeticalSort?: boolean;
}

interface LoadOptions {
    apiRoute: string;
    select: { label: string; id: string };
    refresh?: boolean;
    requestParams?: Record<string, any>;
}

interface FieldConfig {
    value: any;
    type: string;
    props: FieldProps;
    loadOptions?: LoadOptions;
    label?: string;
}

interface FormSection {
    [key: string]: FieldConfig;
}

export interface FormFields {
    left: FormSection;
    right: FormSection; // Corrected key name
    center: FormSection;
    inbound: FormSection;
    outbound: FormSection;
    full: FormSection;
}

export interface ModelFields {
    formFields: ComputedRef<FormFields>;
}