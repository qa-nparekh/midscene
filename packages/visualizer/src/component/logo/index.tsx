import { useTheme } from '../../hooks/useTheme';
import './index.less';

export const LogoUrl =
  'https://lf3-static.bytednsdoc.com/obj/eden-cn/vhaeh7vhabf/Midscene.png';

const LogoUrlLight =
  'https://lf3-static.bytednsdoc.com/obj/eden-cn/nupipfups/Midscene/midscene_with_text_light.png';
const LogoUrlDark =
  'https://lf3-static.bytednsdoc.com/obj/eden-cn/nupipfups/Midscene/midscene_with_text_dark.png';

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
