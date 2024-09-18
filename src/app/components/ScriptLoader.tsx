"use client"
import React, { useEffect, useState } from 'react';

type ScriptLoaderProps = {
  src: string;
};

const ScriptLoader: React.FC<ScriptLoaderProps> = ({ src }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Function to load the script
    const loadScript = () => {
      // Check if the script is already loaded
      if (isScriptLoaded) return;

      // Create and append the script element
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        console.log('Script loaded successfully');
        setIsScriptLoaded(true);
      };
      script.onerror = () => {
        console.error('Error loading the script');
      };

      document.body.appendChild(script);
    };

    // Load the script after the component has mounted
    document.addEventListener('mouseenter', loadScript)

    // Cleanup function to remove the script when the component unmounts
    return () => {
      const script = document.querySelector(`script[src="${src}"]`);
      if (script) {
        document.body.removeChild(script);
      }
      document.removeEventListener('mouseenter', loadScript)
    };
  }, [src, isScriptLoaded]); // Re-run effect if src changes

  return (
    <div>
      {isScriptLoaded && <p className="mt-4 text-green-600">Script loaded successfully!</p>}
    </div>
  );
};

export default ScriptLoader;
