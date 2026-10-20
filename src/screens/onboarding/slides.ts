// Onboarding slides. Slide 1 copy is from assets/images/roam-onboarding.png; slides 2–3 follow the
// same layout. Locations on slides 2–3 are sample labels, not where the photos were taken.
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`;

export type Slide = {
  key: string;
  imageUri: string;
  location: string;
  title: string;
  body: string;
};

export const slides: Slide[] = [
  {
    key: "story",
    imageUri: unsplash("1510798831971-661eb04b3739"),
    location: "Whistler, BC",
    title: "Find a stay that fits your story",
    body: "From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip.",
  },
  {
    key: "describe",
    imageUri: unsplash("1520250497591-112f2f40a3f4"),
    location: "Ubud, Bali",
    title: "Describe it in one sentence",
    body: "Try “quiet pet friendly cabin with a hot tub under $300” and roam ranks the stays that fit.",
  },
  {
    key: "ask",
    imageUri: unsplash("1587061949409-02df41d5e562"),
    location: "Big Sur, CA",
    title: "Ask before you book",
    body: "Get answers on cancellation, pets, and house rules, straight from each stay’s own policies.",
  },
];
