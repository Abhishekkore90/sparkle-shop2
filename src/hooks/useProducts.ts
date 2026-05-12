import { useState, useEffect } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/firebase";
import { products as staticProducts, Product } from "@/data/products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen to the "products" collection in real-time
    const q = query(collection(db, "products"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const firestoreProducts: Product[] = [];
        const deletedIds = new Set<string>();
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.isDeleted) {
            deletedIds.add(doc.id);
            if (data.id) deletedIds.add(data.id);
          } else {
            firestoreProducts.push({ ...data, id: data.id || doc.id } as Product);
          }
        });

        // Use a Map to deduplicate by ID, preferring Firestore products
        const productMap = new Map<string, Product>();
        
        // First, add static products if they aren't marked as deleted
        staticProducts.forEach(p => {
          if (!deletedIds.has(p.id)) {
            productMap.set(p.id, p);
          }
        });
        
        // Then, overwrite with firestore products (this handles "modifies" and "adds")
        firestoreProducts.forEach(p => {
          if (!deletedIds.has(p.id)) {
            productMap.set(p.id, p);
          }
        });

        setProducts(Array.from(productMap.values()));
        setLoading(false);
      } catch (err: any) {
        console.error("Error processing products from Firestore:", err);
        setError(err.message);
        setLoading(false);
      }
    }, (err) => {
      console.error("Error fetching products from Firestore:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { products, loading, error };
}
