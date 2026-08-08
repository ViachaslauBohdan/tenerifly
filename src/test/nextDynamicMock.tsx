import React from "react";

type AnyProps = Record<string, unknown>;
type AnyComponent = React.ComponentType<AnyProps>;

function resolveLoaded(loaded: unknown): AnyComponent {
  if (typeof loaded === "function") {
    return loaded as AnyComponent;
  }

  return (loaded as { default: AnyComponent }).default;
}

/** Vitest-friendly stand-in for `next/dynamic` that resolves the loader and renders it. */
export function createNextDynamicMock() {
  return {
    default: (loader: () => Promise<unknown>) => {
      function DynamicTestComponent(props: AnyProps) {
        const [Comp, setComp] = React.useState<AnyComponent | null>(null);

        React.useEffect(() => {
          void loader().then((loaded) => {
            const resolved = resolveLoaded(loaded);
            setComp(() => resolved);
          });
        }, []);

        if (!Comp) return null;
        return <Comp {...props} />;
      }

      DynamicTestComponent.preload = () => {
        void loader();
      };

      return DynamicTestComponent;
    },
  };
}
