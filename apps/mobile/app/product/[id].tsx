import { DrinkDetailScreen, NavigationContext } from "app";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";

export default function ProductDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigator = useMemo(
    () => ({
      goToProduct: (next: string) => router.push(`/product/${next}` as never),
      goBack: () => router.back(),
    }),
    [router],
  );
  return (
    <NavigationContext.Provider value={navigator}>
      <DrinkDetailScreen productId={id ?? ""} />
    </NavigationContext.Provider>
  );
}
