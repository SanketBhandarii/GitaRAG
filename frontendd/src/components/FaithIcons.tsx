import React from "react";

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const HinduismIcon: React.FC<IconProps> = ({ className, size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path
      d="M24 4C24 4 28 10 28 16C28 20 26 22 24 24C22 22 20 20 20 16C20 10 24 4 24 4Z"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d="M12 18C12 18 18 18 22 22C24 24 24 28 24 28C24 28 24 24 26 22C30 18 36 18 36 18"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d="M16 36C16 36 18 30 22 26C24 24 24 24 24 24C24 24 24 24 26 26C30 30 32 36 32 36"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    <circle cx="24" cy="24" r="3" stroke={color} strokeWidth="2" />
    <path d="M24 38V44" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M20 42H28" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IslamIcon: React.FC<IconProps> = ({ className, size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path
      d="M20 8C14 12 10 18 10 25C10 34 17 40 24 40C31 40 38 34 38 25C38 22 37 19 35 17C33 20 29 22 25 22C21 22 17 19 16 15C15.5 13 17 10 20 8Z"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d="M32 10L33 14L37 14L34 17L35 21L32 18L29 21L30 17L27 14L31 14L32 10Z"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

export const ChristianityIcon: React.FC<IconProps> = ({ className, size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M24 6V42" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M14 18H34" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="24" cy="14" r="4" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M20 38C20 38 22 34 24 34C26 34 28 38 28 38" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const BuddhismIcon: React.FC<IconProps> = ({ className, size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="16" stroke={color} strokeWidth="2" />
    <circle cx="24" cy="24" r="6" stroke={color} strokeWidth="1.5" />
    <path d="M24 8V18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 30V40" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 24H18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M30 24H40" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12.7 12.7L19 19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M29 29L35.3 35.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M35.3 12.7L29 19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M19 29L12.7 35.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const SikhismIcon: React.FC<IconProps> = ({ className, size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="16" stroke={color} strokeWidth="2" />
    <circle cx="24" cy="24" r="8" stroke={color} strokeWidth="1.5" />
    <path d="M14 10L34 38" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M34 10L14 38" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const JudaismIcon: React.FC<IconProps> = ({ className, size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M24 6L38 30H10L24 6Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M24 42L10 18H38L24 42Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const faithIconMap: Record<string, React.FC<IconProps>> = {
  hinduism: HinduismIcon,
  islam: IslamIcon,
  christianity: ChristianityIcon,
  buddhism: BuddhismIcon,
  sikhism: SikhismIcon,
  judaism: JudaismIcon,
};

export const getFaithIcon = (religionId: string): React.FC<IconProps> => {
  return faithIconMap[religionId] || HinduismIcon;
};
