import { MenuScreen, NavigationContext } from "app";
import { useRouter } from "expo-router";
import { useMemo } from "react";

export default function MenuRoute() {
  const router = useRouter();
  const navigator = useMemo(
    () => ({
      goToProduct: (id: string) => router.push(`/product/${id}` as never),
      goBack: () => router.back(),
    }),
    [router],
  );
  return (
    <NavigationContext.Provider value={navigator}>
      <MenuScreen />
    </NavigationContext.Provider>
  );
}
