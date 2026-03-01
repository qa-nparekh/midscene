import { useTheme } from '../../hooks/useTheme';
import './index.less';

export const LogoUrl =
  'https://sqai.tech/logo.png';

const LogoUrlLight =
  'https://sqai.tech/sqai_with_text_light.png';
const LogoUrlDark =
  'https://sqai.tech/sqai_with_text_dark.png';

export const Logo = ({ hideLogo = false }: { hideLogo?: boolean }) => {
  const { isDarkMode } = useTheme();

  if (hideLogo) {
    return null;
  }

  return (
    <div className="logo">
      <div
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: isDarkMode ? '#ffffff' : '#1a1a1a',
          letterSpacing: '2px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        SQAI
      </div>
    </div>
  );
};
