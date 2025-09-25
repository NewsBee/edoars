export async function checkAccess(slug: string): Promise<boolean> {
  try {
    const response = await fetch("/api/sidebar-mahasiswa");
    if (!response.ok) {
      throw new Error("Terjadi kesalahan saat memuat API");
    }
    const result = await response.json();
    const accessible = result.accessibleTypes || [];
    // Cek apakah ada Type dengan slug yang sesuai
    const hasAccess = accessible.some((item: any) => item.Type && item.Type.slug === slug);
    return hasAccess;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}
