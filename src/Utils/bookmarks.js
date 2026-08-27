/**
 * Bookmarks utility — persists saved ads in localStorage.
 * Fires a custom event so any mounted component can react in real-time.
 */

const STORAGE_KEY = "sheypoor_bookmarks";

/** Returns the full array of bookmarked post objects */
export function getBookmarks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

/** Returns true if a post id is already bookmarked */
export function isBookmarked(id) {
  return getBookmarks().some((p) => String(p._id || p.id) === String(id));
}

/** Toggles a post in/out of bookmarks, returns the new bookmarked state */
export function toggleBookmark(post) {
  const current = getBookmarks();
  const id = String(post._id || post.id);
  const exists = current.some((p) => String(p._id || p.id) === id);

  let next;
  if (exists) {
    next = current.filter((p) => String(p._id || p.id) !== id);
  } else {
    // Store a lightweight copy
    next = [
      ...current,
      {
        _id: post._id || post.id,
        id: post.id || post._id,
        amount: post.amount,
        images: post.images?.slice(0, 1) || [],
        options: {
          title: post.options?.title || post.title || "",
          city: post.options?.city || post.city || "",
          content: post.options?.content || post.content || "",
        },
        createdAt: post.createdAt,
        category: post.category,
        categoryName: post.categoryName,
      },
    ];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("sheypoor_bookmarks_updated"));
  return !exists; // true = now bookmarked, false = removed
}

/** Removes a single bookmark by id */
export function removeBookmark(id) {
  const current = getBookmarks();
  const next = current.filter((p) => String(p._id || p.id) !== String(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("sheypoor_bookmarks_updated"));
}

/** Clears all bookmarks */
export function clearBookmarks() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("sheypoor_bookmarks_updated"));
}
