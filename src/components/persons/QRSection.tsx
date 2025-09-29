import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../ui/Button';

interface QRSectionProps {
  value: string;
  filename?: string;
}

export const QRSection = ({ value, filename = 'profile-qr.svg' }: QRSectionProps) => {
  const downloadQR = () => {
    const svg = document.querySelector('svg[data-qr]') as SVGSVGElement;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(value);
      alert('Link copied!');
    } catch {
      alert('Failed to copy link');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <QRCodeSVG value={value} size={180} includeMargin data-qr />
      <div className="flex space-x-2">
        <Button size="sm" variant="outline" onClick={downloadQR}>Download QR</Button>
        <Button size="sm" variant="outline" onClick={copyLink}>Copy Link</Button>
      </div>
    </div>
  );
};
