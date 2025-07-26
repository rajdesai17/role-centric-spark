import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  className?: string;
  validateOnChange?: boolean;
  validator?: (value: string) => { isValid: boolean; errors: string[] };
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = false,
  multiline = false,
  className,
  validateOnChange = false,
  validator
}) => {
  const [localError, setLocalError] = useState<string>("");
  const InputComponent = multiline ? Textarea : Input;
  
  useEffect(() => {
    if (validateOnChange && validator) {
      const validation = validator(value);
      if (!validation.isValid) {
        setLocalError(validation.errors.join(', '));
      } else {
        setLocalError("");
      }
    }
  }, [value, validateOnChange, validator]);

  const displayError = error || localError;
  
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <InputComponent
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full transition-colors",
          displayError && "border-destructive focus:ring-destructive"
        )}
      />
      {displayError && (
        <p className="text-sm text-destructive">{displayError}</p>
      )}
    </div>
  );
};