export type LessonSection = {
  type: 'intro' | 'text' | 'steps' | 'tips' | 'callout';
  title?: string;
  body?: string;
  items?: string[];
};

export type Lesson = {
  id: string;
  readTime: string;
  sections: LessonSection[];
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  image: string;
  time: string;
  calories: number;
  grade: string;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: Ingredient[];
  steps: Step[];
  category: string;
  tags: string[];
};

export type Ingredient = {
  id: string;
  emoji: string;
  amount: string;
  name: string;
  checked?: boolean;
};

export type Step = {
  id: string;
  description: string;
  duration?: string;
};

export type MealPlan = {
  date: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
};

export type ShoppingItem = {
  id: string;
  name: string;
  source: string;
  checked: boolean;
  category: string;
};

export const RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Rustic Mediterranean Quinoa Bowl',
    description:
      'A hearty, protein-packed bowl featuring fluffy quinoa, crispy roasted chickpeas, and a zesty cucumber salad drizzled with our signature tzatziki.',
    image:
      'https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/SfrmHGl8ezw/components/7KDxDhirez4.png',
    time: '20m',
    calories: 420,
    grade: 'A',
    protein: 24,
    carbs: 52,
    fats: 14,
    category: 'Mediterranean',
    tags: ['mediterranean', 'high-protein', 'vegan'],
    ingredients: [
      { id: '1', emoji: '🥗', amount: '1 cup', name: 'Quinoa, cooked' },
      { id: '2', emoji: '🫘', amount: '15 oz', name: 'Chickpeas, drained' },
      { id: '3', emoji: '🥒', amount: '2 ripe', name: 'Cucumbers, diced' },
      { id: '4', emoji: '🧅', amount: '1 small', name: 'Red onion, sliced' },
      { id: '5', emoji: '🍅', amount: '1 cup', name: 'Cherry tomatoes' },
      { id: '6', emoji: '🫒', amount: '2 tbsp', name: 'Olive oil' },
      { id: '7', emoji: '🥛', amount: '½ cup', name: 'Greek yogurt' },
      { id: '8', emoji: '🌿', amount: '1 bunch', name: 'Fresh parsley' },
    ],
    steps: [
      {
        id: '1',
        description:
          'Rinse the quinoa thoroughly under cold water. Combine with 2 cups of water in a pot and bring to a boil.',
        duration: '15:00',
      },
      {
        id: '2',
        description:
          'Toss chickpeas with olive oil and spices. Roast in the oven until crispy and golden brown.',
        duration: '20:00',
      },
      {
        id: '3',
        description:
          'While chickpeas roast, dice cucumbers and tomatoes. Combine with red onion and parsley for the salad.',
      },
      {
        id: '4',
        description:
          'Prepare tzatziki by mixing Greek yogurt with grated cucumber, garlic, lemon juice, and fresh dill.',
      },
      {
        id: '5',
        description:
          'Assemble bowls: start with quinoa base, top with roasted chickpeas, add salad, and finish with tzatziki drizzle.',
      },
    ],
  },
  {
    id: '2',
    title: 'Elevated Sourdough Avocado Toast',
    description:
      'Thick-cut sourdough toasted to perfection, topped with creamy avocado, roasted tomatoes, and microgreens.',
    image:
      'https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/SfrmHGl8ezw/components/NcKuWBHApae.png',
    time: '15m',
    calories: 350,
    grade: 'A',
    protein: 14,
    carbs: 38,
    fats: 18,
    category: 'Breakfast',
    tags: ['vegan', 'under-30'],
    ingredients: [
      { id: '1', emoji: '🍞', amount: '2 slices', name: 'Sourdough bread' },
      { id: '2', emoji: '🥑', amount: '2 ripe', name: 'Avocados' },
      { id: '3', emoji: '🍅', amount: '1 cup', name: 'Cherry tomatoes' },
      { id: '4', emoji: '🌱', amount: '1 handful', name: 'Microgreens' },
      { id: '5', emoji: '🍋', amount: '1', name: 'Lemon, juiced' },
      { id: '6', emoji: '🧂', amount: 'To taste', name: 'Salt & pepper' },
    ],
    steps: [
      {
        id: '1',
        description: 'Preheat oven to 400°F. Toss cherry tomatoes with olive oil, salt, and pepper.',
        duration: '5:00',
      },
      {
        id: '2',
        description: 'Roast tomatoes until burst and caramelized.',
        duration: '15:00',
      },
      {
        id: '3',
        description:
          'Toast sourdough until golden and crispy. Mash avocado with lemon juice, salt, and red pepper flakes.',
      },
      {
        id: '4',
        description:
          'Spread avocado mixture on toast, top with roasted tomatoes and microgreens. Finish with a drizzle of olive oil.',
      },
    ],
  },
  {
    id: '3',
    title: 'Blueberry Protein Oats',
    description:
      'Creamy overnight oats loaded with fresh blueberries, protein powder, and a drizzle of almond butter.',
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&q=80',
    time: '10m',
    calories: 320,
    grade: 'A',
    protein: 18,
    carbs: 45,
    fats: 8,
    category: 'Breakfast',
    tags: ['high-protein', 'under-30'],
    ingredients: [
      { id: '1', emoji: '🌾', amount: '½ cup', name: 'Rolled oats' },
      { id: '2', emoji: '🫐', amount: '½ cup', name: 'Fresh blueberries' },
      { id: '3', emoji: '🥛', amount: '1 cup', name: 'Almond milk' },
      { id: '4', emoji: '💪', amount: '1 scoop', name: 'Vanilla protein powder' },
      { id: '5', emoji: '🥜', amount: '1 tbsp', name: 'Almond butter' },
      { id: '6', emoji: '🍯', amount: '1 tsp', name: 'Honey' },
    ],
    steps: [
      {
        id: '1',
        description: 'Combine oats, protein powder, and almond milk in a jar. Stir well.',
      },
      {
        id: '2',
        description: 'Cover and refrigerate overnight or for at least 4 hours.',
        duration: '4:00',
      },
      {
        id: '3',
        description:
          'In the morning, top with fresh blueberries, a drizzle of almond butter, and honey.',
      },
    ],
  },
  {
    id: '4',
    title: 'Smoky Chicken Street Tacos',
    description: 'Juicy chipotle-marinated chicken thighs in warm corn tortillas with fresh pico de gallo, avocado crema, and a squeeze of lime.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
    time: '25m',
    calories: 480,
    grade: 'B',
    protein: 38,
    carbs: 42,
    fats: 16,
    category: 'Mexican',
    tags: ['mexican', 'high-protein', 'under-30'],
    ingredients: [
      { id: '1', emoji: '🍗', amount: '1 lb', name: 'Chicken thighs, boneless' },
      { id: '2', emoji: '🌽', amount: '8', name: 'Corn tortillas' },
      { id: '3', emoji: '🥑', amount: '2 ripe', name: 'Avocados' },
      { id: '4', emoji: '🍅', amount: '1 cup', name: 'Pico de gallo' },
      { id: '5', emoji: '🧅', amount: '½ cup', name: 'White onion, diced' },
      { id: '6', emoji: '🌿', amount: '1 handful', name: 'Fresh cilantro' },
      { id: '7', emoji: '🍋', amount: '2', name: 'Limes' },
      { id: '8', emoji: '🧂', amount: '2 tbsp', name: 'Chipotle seasoning' },
    ],
    steps: [
      { id: '1', description: 'Rub chicken thighs with chipotle seasoning, garlic powder, cumin, and a pinch of salt. Let marinate for 10 minutes.' },
      { id: '2', description: 'Heat a cast-iron skillet over high heat. Sear chicken 5–6 minutes per side until charred and cooked through.', duration: '12:00' },
      { id: '3', description: 'Rest the chicken for 5 minutes then slice thinly against the grain.' },
      { id: '4', description: 'Warm corn tortillas directly over a gas flame or in a dry skillet for 30 seconds each side.' },
      { id: '5', description: 'Mash avocado with lime juice and salt for the crema. Assemble tacos with chicken, pico, onion, crema, and cilantro.' },
    ],
  },
  {
    id: '5',
    title: 'Spiced Red Lentil Curry',
    description: 'A rich, warming vegan curry simmered with red lentils, coconut milk, and aromatic spices. Ready in under 40 minutes and packed with plant-based protein.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
    time: '35m',
    calories: 390,
    grade: 'A',
    protein: 22,
    carbs: 58,
    fats: 10,
    category: 'Vegan',
    tags: ['vegan', 'high-protein', 'mediterranean'],
    ingredients: [
      { id: '1', emoji: '🫘', amount: '1 cup', name: 'Red lentils, rinsed' },
      { id: '2', emoji: '🥥', amount: '1 cup', name: 'Coconut milk' },
      { id: '3', emoji: '🍅', amount: '1 cup', name: 'Crushed tomatoes' },
      { id: '4', emoji: '🧅', amount: '1 small', name: 'Yellow onion, diced' },
      { id: '5', emoji: '🧄', amount: '3', name: 'Garlic cloves, minced' },
      { id: '6', emoji: '🫚', amount: '1 tbsp', name: 'Coconut oil' },
      { id: '7', emoji: '🌶️', amount: '2 tsp', name: 'Curry powder' },
      { id: '8', emoji: '🌿', amount: '1 handful', name: 'Fresh spinach' },
    ],
    steps: [
      { id: '1', description: 'Heat coconut oil in a large pot over medium heat. Sauté onion until softened, about 5 minutes. Add garlic and cook 1 minute more.' },
      { id: '2', description: 'Stir in curry powder, cumin, and turmeric. Toast spices for 30 seconds until fragrant.' },
      { id: '3', description: 'Add rinsed lentils, crushed tomatoes, coconut milk, and 1½ cups water. Bring to a boil.', duration: '5:00' },
      { id: '4', description: 'Reduce heat and simmer uncovered for 20–25 minutes, stirring occasionally, until lentils are tender and the curry has thickened.', duration: '25:00' },
      { id: '5', description: 'Stir in fresh spinach until wilted. Season with salt, pepper, and a squeeze of lemon. Serve over rice.' },
    ],
  },
  {
    id: '6',
    title: 'Shakshuka with Feta',
    description: 'Eggs poached in a spiced tomato and pepper sauce, finished with crumbled feta and fresh herbs. A one-pan Mediterranean classic ready in 25 minutes.',
    image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&q=80',
    time: '25m',
    calories: 310,
    grade: 'A',
    protein: 18,
    carbs: 22,
    fats: 16,
    category: 'Mediterranean',
    tags: ['mediterranean', 'under-30', 'vegan'],
    ingredients: [
      { id: '1', emoji: '🥚', amount: '4', name: 'Eggs' },
      { id: '2', emoji: '🍅', amount: '1 cup', name: 'Crushed tomatoes' },
      { id: '3', emoji: '🫑', amount: '1', name: 'Red bell pepper, diced' },
      { id: '4', emoji: '🧅', amount: '1 small', name: 'Yellow onion, diced' },
      { id: '5', emoji: '🧄', amount: '3', name: 'Garlic cloves, minced' },
      { id: '6', emoji: '🌶️', amount: '1 tsp', name: 'Smoked paprika' },
      { id: '7', emoji: '🧀', amount: '½ cup', name: 'Feta cheese, crumbled' },
      { id: '8', emoji: '🌿', amount: '1 handful', name: 'Fresh parsley' },
    ],
    steps: [
      { id: '1', description: 'Heat olive oil in a wide skillet over medium heat. Sauté onion and pepper until softened, about 6 minutes. Add garlic and cook 1 minute.' },
      { id: '2', description: 'Add smoked paprika, cumin, and chilli flakes. Stir for 30 seconds, then pour in crushed tomatoes. Season well and simmer 8 minutes until the sauce thickens.' },
      { id: '3', description: 'Make 4 shallow wells in the sauce with a spoon. Crack an egg into each well.' },
      { id: '4', description: 'Cover and cook over medium-low heat for 5–7 minutes until whites are set but yolks are still runny.' },
      { id: '5', description: 'Remove from heat, scatter feta and parsley over the top. Serve straight from the pan with crusty bread.' },
    ],
  },
  {
    id: '7',
    title: 'Miso Glazed Salmon',
    description: 'Oven-baked salmon fillets coated in a sweet and savory white miso glaze, served with steamed edamame and sesame-dressed cucumber.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
    time: '20m',
    calories: 460,
    grade: 'A',
    protein: 42,
    carbs: 18,
    fats: 22,
    category: 'Asian',
    tags: ['high-protein', 'under-30'],
    ingredients: [
      { id: '1', emoji: '🐟', amount: '2', name: 'Salmon fillets (6 oz each)' },
      { id: '2', emoji: '🍶', amount: '2 tbsp', name: 'White miso paste' },
      { id: '3', emoji: '🍯', amount: '1 tbsp', name: 'Honey' },
      { id: '4', emoji: '🧂', amount: '1 tbsp', name: 'Soy sauce' },
      { id: '5', emoji: '🫚', amount: '1 tsp', name: 'Sesame oil' },
      { id: '6', emoji: '🥒', amount: '1', name: 'Cucumber, thinly sliced' },
      { id: '7', emoji: '🌱', amount: '1 cup', name: 'Edamame, shelled' },
      { id: '8', emoji: '🌿', amount: '2', name: 'Spring onions, sliced' },
    ],
    steps: [
      { id: '1', description: 'Preheat oven to 425°F (220°C). Whisk together miso, honey, soy sauce, and sesame oil into a smooth glaze.' },
      { id: '2', description: 'Pat salmon fillets dry and place on a lined baking sheet. Spoon glaze generously over each fillet.' },
      { id: '3', description: 'Bake for 12–14 minutes until the glaze is caramelised and the salmon flakes easily at its thickest point.' },
      { id: '4', description: 'While salmon bakes, toss cucumber slices with a little rice vinegar, sesame oil, and a pinch of salt.' },
      { id: '5', description: 'Serve salmon over steamed rice with edamame, dressed cucumber, and spring onions.' },
    ],
  },
  {
    id: '8',
    title: 'Thai Basil Chicken',
    description: 'Authentic Pad Krapow — minced chicken stir-fried with garlic, bird\'s eye chilli, oyster sauce, and heaps of fresh Thai basil. On the table in 15 minutes.',
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80',
    time: '15m',
    calories: 420,
    grade: 'B',
    protein: 36,
    carbs: 28,
    fats: 14,
    category: 'Asian',
    tags: ['high-protein', 'under-30'],
    ingredients: [
      { id: '1', emoji: '🍗', amount: '1 lb', name: 'Chicken mince' },
      { id: '2', emoji: '🌿', amount: '1 cup', name: 'Fresh Thai basil leaves' },
      { id: '3', emoji: '🧄', amount: '4', name: 'Garlic cloves, minced' },
      { id: '4', emoji: '🌶️', amount: '3', name: "Bird's eye chillies, sliced" },
      { id: '5', emoji: '🧂', amount: '2 tbsp', name: 'Oyster sauce' },
      { id: '6', emoji: '🍶', amount: '1 tbsp', name: 'Fish sauce' },
      { id: '7', emoji: '🫚', amount: '1 tbsp', name: 'Neutral oil' },
      { id: '8', emoji: '🥚', amount: '2', name: 'Eggs, for frying' },
    ],
    steps: [
      { id: '1', description: 'Heat oil in a wok or large skillet over high heat until smoking. Add garlic and chillies and stir-fry for 20 seconds.' },
      { id: '2', description: 'Add chicken mince and press into a single layer. Let it sear undisturbed for 90 seconds before breaking it up.' },
      { id: '3', description: 'Stir in oyster sauce, fish sauce, and a pinch of sugar. Toss everything together and cook until the sauce coats the chicken.' },
      { id: '4', description: 'Remove from heat and fold in Thai basil leaves — they will wilt from the residual heat.' },
      { id: '5', description: 'Fry eggs in a separate pan in hot oil until whites are crispy and yolks are runny. Serve chicken over jasmine rice, topped with the fried egg.' },
    ],
  },
  {
    id: '9',
    title: 'Açaí Smoothie Bowl',
    description: 'Thick, frozen açaí blended with banana and almond milk, topped with granola, fresh fruit, honey, and coconut flakes. A nutrient-dense breakfast in 10 minutes.',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80',
    time: '10m',
    calories: 380,
    grade: 'A',
    protein: 8,
    carbs: 62,
    fats: 12,
    category: 'Breakfast',
    tags: ['vegan', 'under-30'],
    ingredients: [
      { id: '1', emoji: '🫐', amount: '3.5 oz', name: 'Frozen açaí packet' },
      { id: '2', emoji: '🍌', amount: '1', name: 'Frozen banana' },
      { id: '3', emoji: '🥛', amount: '½ cup', name: 'Almond milk' },
      { id: '4', emoji: '🌾', amount: '½ cup', name: 'Granola' },
      { id: '5', emoji: '🍓', amount: '½ cup', name: 'Fresh strawberries, sliced' },
      { id: '6', emoji: '🍯', amount: '1 tbsp', name: 'Honey' },
      { id: '7', emoji: '🥥', amount: '2 tbsp', name: 'Coconut flakes, toasted' },
      { id: '8', emoji: '🫐', amount: '¼ cup', name: 'Fresh blueberries' },
    ],
    steps: [
      { id: '1', description: 'Break the frozen açaí packet into chunks and add to a blender with the frozen banana and almond milk.' },
      { id: '2', description: 'Blend on high until completely smooth and very thick — add almond milk one tablespoon at a time only if needed. The mixture should be thicker than a smoothie.' },
      { id: '3', description: 'Pour into a cold bowl immediately and smooth the surface with the back of a spoon.' },
      { id: '4', description: 'Arrange granola, strawberries, blueberries, and coconut flakes in rows across the bowl. Drizzle with honey and serve immediately.' },
    ],
  },
  {
    id: '10',
    title: 'Tuscan White Bean Soup',
    description: 'A hearty Italian ribollita-style soup with creamy cannellini beans, wilted cavolo nero, rosemary, and a generous drizzle of peppery extra-virgin olive oil.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
    time: '30m',
    calories: 340,
    grade: 'A',
    protein: 16,
    carbs: 48,
    fats: 10,
    category: 'Italian',
    tags: ['vegan', 'high-protein', 'mediterranean'],
    ingredients: [
      { id: '1', emoji: '🫘', amount: '15 oz', name: 'Cannellini beans, drained' },
      { id: '2', emoji: '🌿', amount: '3 cups', name: 'Cavolo nero (kale), chopped' },
      { id: '3', emoji: '🍅', amount: '1 cup', name: 'Crushed tomatoes' },
      { id: '4', emoji: '🧅', amount: '1 small', name: 'Yellow onion, diced' },
      { id: '5', emoji: '🧄', amount: '4', name: 'Garlic cloves, minced' },
      { id: '6', emoji: '🌿', amount: '2', name: 'Rosemary sprigs' },
      { id: '7', emoji: '🫒', amount: '3 tbsp', name: 'Extra-virgin olive oil' },
      { id: '8', emoji: '🍞', amount: '2 slices', name: 'Crusty bread, toasted' },
    ],
    steps: [
      { id: '1', description: 'Heat 2 tbsp olive oil in a heavy pot over medium heat. Sauté onion until golden, about 8 minutes. Add garlic and rosemary and cook 1 minute.' },
      { id: '2', description: 'Add crushed tomatoes and cook 3 minutes until the sauce darkens slightly.' },
      { id: '3', description: 'Add beans and 3 cups of water or vegetable stock. Bring to a simmer. Mash about a quarter of the beans against the side of the pot to thicken the broth.' },
      { id: '4', description: 'Stir in the cavolo nero and simmer for 10 minutes until completely tender. Season generously with salt and pepper.' },
      { id: '5', description: 'Ladle into bowls over a slice of toasted bread. Finish with a heavy drizzle of your best olive oil and a crack of black pepper.' },
    ],
  },
];

export const TRENDING_TAGS = [
  { id: '1', label: 'High Protein', emoji: '💪', key: 'high-protein' },
  { id: '2', label: 'Vegan', emoji: '🥦', key: 'vegan' },
  { id: '3', label: 'Under 30 Mins', emoji: '⚡', key: 'under-30' },
  { id: '4', label: 'Mexican', emoji: '🌮', key: 'mexican' },
  { id: '5', label: 'Mediterranean', emoji: '🫒', key: 'mediterranean' },
];

export const MEAL_PLAN_DAYS: MealPlan[] = [
  {
    date: '2024-10-14',
    breakfast: RECIPES[2],
    lunch: RECIPES[0],
  },
  { date: '2024-10-15' },
  { date: '2024-10-16' },
  { date: '2024-10-17' },
  { date: '2024-10-18' },
  { date: '2024-10-19' },
];

export const SHOPPING_CATEGORIES: { id: string; label: string; emoji: string; bgColor: string; items: ShoppingItem[] }[] = [
  {
    id: 'produce',
    label: 'Produce',
    emoji: '🥦',
    bgColor: '#dcfce7',
    items: [
      {
        id: '1',
        name: '2 ripe Cucumbers',
        source: 'For Mediterranean Quinoa Bowl',
        checked: false,
        category: 'produce',
      },
      {
        id: '2',
        name: 'Baby Spinach, 1 bag',
        source: 'For Smoothies',
        checked: true,
        category: 'produce',
      },
      {
        id: '3',
        name: 'Fresh Parsley, 1 bunch',
        source: 'For Mediterranean Quinoa Bowl',
        checked: false,
        category: 'produce',
      },
    ],
  },
  {
    id: 'pantry',
    label: 'Pantry',
    emoji: '🫙',
    bgColor: '#fef3c7',
    items: [
      {
        id: '4',
        name: 'Quinoa, 1 box',
        source: 'Multiple recipes',
        checked: false,
        category: 'pantry',
      },
      {
        id: '5',
        name: 'Canned Chickpeas, 2 cans',
        source: 'For Mediterranean Quinoa Bowl',
        checked: false,
        category: 'pantry',
      },
    ],
  },
  {
    id: 'dairy',
    label: 'Dairy & Eggs',
    emoji: '🥛',
    bgColor: '#dbeafe',
    items: [
      {
        id: '6',
        name: 'Greek Yogurt, 500g',
        source: 'For Tzatziki dressing',
        checked: false,
        category: 'dairy',
      },
    ],
  },
  {
    id: 'meat',
    label: 'Meat & Fish',
    emoji: '🥩',
    bgColor: '#fee2e2',
    items: [],
  },
];

export const COOKING_COURSES = [
  // ── Complete Beginner ──────────────────────────────────────────
  {
    id: 'b1',
    level: 1,
    title: 'Setting Up Your Kitchen',
    description: 'Essential tools, pantry staples, and organising your workspace.',
    image: 'https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/SfrmHGl8ezw/components/jcGTWZ1MpGQ.png',
    progress: 1,
    section: 'beginner',
    locked: false,
  },
  {
    id: 'b2',
    level: 2,
    title: 'Building Blocks of Flavor',
    description: 'Understanding salt, fat, acid, and heat — the four elements of great food.',
    image: 'https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/SfrmHGl8ezw/components/9lSlZNdupuM.png',
    progress: 0.45,
    section: 'beginner',
    locked: false,
  },
  {
    id: 'b3',
    level: 3,
    title: 'Knife Skills 101',
    description: 'How to hold, sharpen, and use a chef\'s knife safely and efficiently.',
    image: 'https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/SfrmHGl8ezw/components/3NYX32b6OxO.png',
    progress: 0,
    section: 'beginner',
    locked: false,
  },
  {
    id: 'b4',
    level: 4,
    title: 'Reading a Recipe',
    description: 'Decode measurements, temperatures, and timing before you start cooking.',
    image: null,
    progress: 0,
    section: 'beginner',
    locked: true,
  },
  {
    id: 'b5',
    level: 5,
    title: 'Stovetop Fundamentals',
    description: 'Boiling, simmering, sautéing — how heat transforms ingredients.',
    image: null,
    progress: 0,
    section: 'beginner',
    locked: true,
  },
  {
    id: 'b6',
    level: 6,
    title: 'Cooking with Eggs',
    description: 'Scrambled, poached, fried, and folded — eggs teach every technique.',
    image: null,
    progress: 0,
    section: 'beginner',
    locked: true,
  },
  {
    id: 'b7',
    level: 7,
    title: 'Roasting Vegetables',
    description: 'Caramelisation, the Maillard reaction, and making vegetables irresistible.',
    image: 'https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/SfrmHGl8ezw/components/8ON6gkSqO80.png',
    progress: 0,
    section: 'beginner',
    locked: true,
  },
  {
    id: 'b8',
    level: 8,
    title: 'Rice, Grains & Legumes',
    description: 'Cook rice, lentils, and grains perfectly every time without guesswork.',
    image: null,
    progress: 0,
    section: 'beginner',
    locked: true,
  },
  {
    id: 'b9',
    level: 9,
    title: 'Simple Sauces & Dressings',
    description: 'Pan sauces, vinaigrettes, and dips that elevate any dish instantly.',
    image: null,
    progress: 0,
    section: 'beginner',
    locked: true,
  },
  {
    id: 'b10',
    level: 10,
    title: 'Your First Complete Meal',
    description: 'Plan, prep, and execute a balanced three-course meal start to finish.',
    image: null,
    progress: 0,
    section: 'beginner',
    locked: true,
  },

  // ── Intermediate ───────────────────────────────────────────────
  {
    id: 'i1',
    level: 1,
    title: 'Stock & Broth Fundamentals',
    description: 'Chicken, beef, and vegetable stocks — the backbone of professional cooking.',
    image: null,
    progress: 0,
    section: 'intermediate',
    locked: true,
  },
  {
    id: 'i2',
    level: 2,
    title: 'Braising & Slow Cooking',
    description: 'Low-and-slow techniques that transform tough cuts into tender perfection.',
    image: null,
    progress: 0,
    section: 'intermediate',
    locked: true,
  },
  {
    id: 'i3',
    level: 3,
    title: 'Stir-Fry Mastery',
    description: 'High-heat wok cooking: timing, layering, and building deep umami flavour.',
    image: null,
    progress: 0,
    section: 'intermediate',
    locked: true,
  },
  {
    id: 'i4',
    level: 4,
    title: 'Fresh Pasta from Scratch',
    description: 'Hand-roll fettuccine, ravioli, and gnocchi with just flour and eggs.',
    image: null,
    progress: 0,
    section: 'intermediate',
    locked: true,
  },
  {
    id: 'i5',
    level: 5,
    title: 'The Art of Seasoning',
    description: 'When, how, and why to season at each stage of cooking — not just at the end.',
    image: null,
    progress: 0,
    section: 'intermediate',
    locked: true,
  },
  {
    id: 'i6',
    level: 6,
    title: 'Cooking Fish & Seafood',
    description: 'Temperature, texture, and technique for salmon, shrimp, scallops, and more.',
    image: null,
    progress: 0,
    section: 'intermediate',
    locked: true,
  },
  {
    id: 'i7',
    level: 7,
    title: 'Bread Baking Basics',
    description: 'Yeast, gluten development, proofing, and achieving the perfect crust.',
    image: null,
    progress: 0,
    section: 'intermediate',
    locked: true,
  },
  {
    id: 'i8',
    level: 8,
    title: 'Emulsification',
    description: 'The science of hollandaise, mayonnaise, and stable emulsified sauces.',
    image: null,
    progress: 0,
    section: 'intermediate',
    locked: true,
  },
  {
    id: 'i9',
    level: 9,
    title: 'Fermentation & Pickling',
    description: 'Make kimchi, pickles, yogurt, and kombucha using controlled fermentation.',
    image: null,
    progress: 0,
    section: 'intermediate',
    locked: true,
  },
  {
    id: 'i10',
    level: 10,
    title: 'Mise en Place & Menu Planning',
    description: 'Think and prep like a professional — organise multi-dish meals with confidence.',
    image: null,
    progress: 0,
    section: 'intermediate',
    locked: true,
  },

  // ── Advanced ───────────────────────────────────────────────────
  {
    id: 'a1',
    level: 1,
    title: 'The Five Mother Sauces',
    description: 'Béchamel, velouté, espagnole, hollandaise, and sauce tomat — mastered.',
    image: null,
    progress: 0,
    section: 'advanced',
    locked: true,
  },
  {
    id: 'a2',
    level: 2,
    title: 'Sous Vide Technique',
    description: 'Precision temperature cooking for perfect proteins and vegetables every time.',
    image: null,
    progress: 0,
    section: 'advanced',
    locked: true,
  },
  {
    id: 'a3',
    level: 3,
    title: 'Pastry & Baking Science',
    description: 'The chemistry of butter, sugar, and gluten in croissants, tarts, and cakes.',
    image: null,
    progress: 0,
    section: 'advanced',
    locked: true,
  },
  {
    id: 'a4',
    level: 4,
    title: 'Butchery & Protein Breakdown',
    description: 'Breaking down a whole chicken, beef primal cuts, and fish fabrication.',
    image: null,
    progress: 0,
    section: 'advanced',
    locked: true,
  },
  {
    id: 'a5',
    level: 5,
    title: 'Advanced Plating & Presentation',
    description: 'Geometry, colour theory, and negative space for restaurant-quality aesthetics.',
    image: null,
    progress: 0,
    section: 'advanced',
    locked: true,
  },
  {
    id: 'a6',
    level: 6,
    title: 'Flavour Pairing Science',
    description: 'Use aroma compounds and contrast to build dishes that surprise and delight.',
    image: null,
    progress: 0,
    section: 'advanced',
    locked: true,
  },
  {
    id: 'a7',
    level: 7,
    title: 'World Regional Cuisines',
    description: 'Authentic techniques from Japanese, Mexican, Indian, and French kitchens.',
    image: null,
    progress: 0,
    section: 'advanced',
    locked: true,
  },
  {
    id: 'a8',
    level: 8,
    title: 'Molecular Gastronomy',
    description: 'Spherification, gels, foams, and modernist techniques from the lab kitchen.',
    image: null,
    progress: 0,
    section: 'advanced',
    locked: true,
  },
  {
    id: 'a9',
    level: 9,
    title: 'Charcuterie & Curing',
    description: 'Salt-curing, smoking, and fermenting meats to make salami, bacon, and pâté.',
    image: null,
    progress: 0,
    section: 'advanced',
    locked: true,
  },
  {
    id: 'a10',
    level: 10,
    title: 'The Chef\'s Mindset',
    description: 'Creativity, improvisation, and developing your own signature cooking style.',
    image: null,
    progress: 0,
    section: 'advanced',
    locked: true,
  },
];

export const LESSONS: Lesson[] = [
  // ─── BEGINNER ────────────────────────────────────────────────────────────────
  {
    id: 'b1',
    readTime: '8 min read',
    sections: [
      {
        type: 'intro',
        body: 'Before you cook a single meal, your kitchen setup determines whether cooking feels joyful or chaotic. Professional chefs call this readiness "mise en place" — a French phrase meaning "everything in its place." Getting your tools, pantry, and workspace right from the start builds a foundation every skill you learn later will rely on.',
      },
      {
        type: 'text',
        title: 'The Essential Tool Kit',
        body: "You don't need every gadget. The 90/10 rule applies in kitchens: 90% of cooking is done with 10% of the tools. Start with a sharp 8-inch chef's knife, a wooden or plastic cutting board, a 10-inch stainless steel or cast-iron skillet, a medium saucepan, a sheet pan, and a set of mixing bowls. These seven items cover the vast majority of home cooking.",
      },
      {
        type: 'steps',
        title: 'Building Your Pantry Foundation',
        items: [
          'Fats: extra-virgin olive oil for finishing, neutral oil (avocado or canola) for high-heat cooking, and unsalted butter.',
          'Salt: kosher salt for cooking (it\'s coarser and easier to pinch) and flaky sea salt (like Maldon) for finishing dishes at the table.',
          'Acids: red and white wine vinegar, apple cider vinegar, and fresh lemons. Acid brightens every dish.',
          'Aromatics: garlic, yellow onions, and shallots. These are the flavour base of cuisines worldwide.',
          'Dried spices: cumin, smoked paprika, chilli flakes, black pepper, dried oregano, and cinnamon.',
          'Canned goods: whole peeled tomatoes (San Marzano if possible), chickpeas, lentils, and coconut milk.',
        ],
      },
      {
        type: 'tips',
        title: 'Pro Tips',
        items: [
          'Buy the best knife you can afford and keep it sharp — a sharp knife is safer than a dull one because it requires less force.',
          'Store onions and garlic at room temperature in a dark spot; refrigerating them turns them mealy.',
          'Label everything in your pantry with the purchase date. Spices lose potency after 12–18 months.',
          'Keep a small bowl on the counter for salt while cooking — reaching into a salt box is faster and more accurate than a shaker.',
        ],
      },
      {
        type: 'callout',
        title: 'Key Principle',
        body: 'A clean, organised kitchen reduces decision fatigue. Before every cooking session, clear your counter, set out all ingredients, and read the full recipe once. Chefs call this your "pre-flight checklist."',
      },
    ],
  },
  {
    id: 'b2',
    readTime: '10 min read',
    sections: [
      {
        type: 'intro',
        body: 'In her landmark book "Salt, Fat, Acid, Heat," chef Samin Nosrat argues that mastering four elements — not hundreds of recipes — is the real path to becoming a good cook. Every dish you\'ve ever loved succeeded because it balanced these four forces. Every dish that disappointed you failed because one of them was off.',
      },
      {
        type: 'text',
        title: 'Salt: The Great Enhancer',
        body: "Salt doesn't just make things taste salty — it suppresses bitterness and amplifies every other flavour. The key insight is timing: salt penetrates food gradually, so seasoning early (especially proteins) gives it time to work. A chicken seasoned the night before will be more flavourful throughout, not just on the surface. Taste as you cook and season in layers.",
      },
      {
        type: 'text',
        title: 'Fat: The Carrier of Flavour',
        body: 'Most aroma compounds are fat-soluble, meaning fat literally carries flavour to your taste receptors. Fat also adds richness, creates texture (think crispy skin or flaky pastry), and conducts heat. Different fats have different flavour profiles — butter adds nuttiness, olive oil adds fruitiness, and rendered animal fats like lard add deep savoriness.',
      },
      {
        type: 'text',
        title: 'Acid: The Brightener',
        body: 'Acid (vinegar, citrus juice, wine, yogurt) cuts through richness, brightens dull flavours, and provides contrast. It\'s the secret behind why squeezing lemon over fish or adding a splash of vinegar to a braise transforms it. If a dish tastes flat, add acid before adding salt — often it\'s acid that\'s missing, not salt.',
      },
      {
        type: 'text',
        title: 'Heat: The Transformer',
        body: 'Heat is the most complex element because its effect changes completely depending on temperature and time. High heat drives the Maillard reaction — a chemical reaction between proteins and sugars that creates hundreds of flavour compounds and brown colour. Low heat extracts collagen from tough cuts, transforming it into silky gelatin. Matching the right heat to the right ingredient is the heart of cooking technique.',
      },
      {
        type: 'tips',
        title: 'Balancing the Four Elements',
        items: [
          'If a dish tastes dull: add acid first, then salt — they\'re often confused.',
          'If a dish is too acidic: add fat (butter, cream, or olive oil) to mellow it.',
          'If a dish tastes flat despite correct seasoning: it likely needs more heat earlier — properly caramelised aromatics build the flavour base.',
          'Taste everything at every stage. Your palate is the most important tool you own.',
        ],
      },
    ],
  },
  {
    id: 'b3',
    readTime: '9 min read',
    sections: [
      {
        type: 'intro',
        body: 'The chef\'s knife is the single most important tool in the kitchen, and how you hold and move it determines your speed, safety, and precision. Most home cooks use knives incorrectly for years — a few minutes of technique correction can make you dramatically more efficient and dramatically safer.',
      },
      {
        type: 'steps',
        title: 'The Correct Grip: Pinch Grip',
        items: [
          'Grip the blade itself — not the handle — between your thumb and the side of your bent index finger, right where the blade meets the bolster.',
          'Wrap your remaining three fingers loosely around the handle.',
          'This "pinch grip" gives you control of the blade\'s direction, reduces hand fatigue, and is how every professional chef holds a knife.',
          'If you\'re gripping only the handle, you\'re relying on the handle to steer — the blade steers the knife, not the handle.',
        ],
      },
      {
        type: 'steps',
        title: 'The Claw: Protecting Your Fingers',
        items: [
          'Curl your fingertips under so your knuckles form a flat vertical surface facing the blade.',
          'Rest the flat of the blade against your knuckles as you cut — this physically prevents the blade from reaching your fingertips.',
          'The thumb should be tucked behind your fingers at all times.',
          'As you cut, "walk" your knuckles backward away from the blade — the knuckles guide the slice width.',
        ],
      },
      {
        type: 'text',
        title: 'Essential Cuts',
        body: 'A chop is rough and uneven — fine for stocks. A dice is a precise cube (large: ¾", medium: ½", small: ¼", brunoise: ⅛"). A mince is a very fine irregular chop, used for garlic and herbs. A julienne is thin matchstick strips (⅛" × ⅛" × 2"). A chiffonade is thin ribbons of leafy greens made by stacking, rolling, and slicing crosswise. Each cut affects both the texture and how quickly the ingredient cooks.',
      },
      {
        type: 'steps',
        title: 'Keeping Your Knife Sharp',
        items: [
          'Use a honing steel before every cooking session — this realigns the microscopic edge of the blade without removing metal.',
          'Sharpen with a whetstone or professional service 2–4 times per year depending on use.',
          'Never put your knife in the dishwasher — heat and detergent destroy the edge and handle.',
          'Store on a magnetic strip or in a knife block, never loose in a drawer where blades clash.',
        ],
      },
      {
        type: 'callout',
        title: 'Safety First',
        body: 'A sharp knife is safer than a dull one. Dull knives require more pressure, slip off food more easily, and cause more accidents. Invest in a honing steel and use it every single time you cook.',
      },
    ],
  },
  {
    id: 'b4',
    readTime: '7 min read',
    sections: [
      {
        type: 'intro',
        body: 'Recipes are a map, not a script. Understanding what a recipe is actually communicating — not just following its instructions blindly — is what separates a cook from someone who merely follows directions. Once you can decode a recipe, you can adapt it, fix it when it goes wrong, and eventually stop needing it altogether.',
      },
      {
        type: 'text',
        title: 'Volume vs. Weight',
        body: 'Volume measurements (cups, tablespoons, teaspoons) are convenient but imprecise — a cup of sifted flour weighs far less than a cup of packed flour. Weight measurements (grams, ounces) are exact and reproducible. Baking almost always benefits from a kitchen scale. Cooking is more forgiving, but developing the habit of weighing builds accuracy. Always use a scale for anything that needs to be exact: bread, pastry, curing, and spice blends.',
      },
      {
        type: 'steps',
        title: 'Decoding Cooking Verbs',
        items: [
          'Fold: use a spatula to cut down through the batter and lift it up in a J-motion — never stir, which deflates air.',
          'Simmer: small bubbles occasionally breaking the surface (180–200°F/82–93°C) — gentle, sustained heat.',
          'Boil: rolling, vigorous bubbles throughout (212°F/100°C at sea level).',
          'Sauté: cook quickly over medium-high heat in a small amount of fat with frequent movement.',
          'Sweat: cook vegetables slowly over low heat without browning, until softened and translucent.',
          'Reduce: simmer a liquid to evaporate water, concentrating flavour and thickening consistency.',
          'Deglaze: add liquid to a hot pan to lift the browned bits (fond) stuck to the bottom — those bits are concentrated flavour.',
        ],
      },
      {
        type: 'tips',
        title: 'Recipe Reading Habits',
        items: [
          'Read the entire recipe before starting — mise en place begins in your head.',
          'Note any inactive time (marinating, chilling, resting) and work backwards from when you want to serve.',
          'Ingredients listed first in the list are usually the most important and often dictate the dish\'s identity.',
          'When a recipe says "season to taste," it means taste and adjust — not just add salt automatically.',
        ],
      },
    ],
  },
  {
    id: 'b5',
    readTime: '9 min read',
    sections: [
      {
        type: 'intro',
        body: 'The stovetop is where most everyday cooking happens, and understanding the relationship between heat, fat, and your pan determines whether food sticks, burns, or comes out perfectly. Most home cooking problems — food sticking, uneven cooking, steaming instead of searing — come from not managing this relationship correctly.',
      },
      {
        type: 'text',
        title: 'Boiling and Simmering',
        body: 'Boiling (212°F/100°C) is violent — it\'s the right tool for pasta (which needs agitation to prevent sticking) and blanching vegetables quickly. Simmering is gentle (180–200°F) and is used for soups, stocks, braises, and sauces. A "rolling boil" for pasta means full, vigorous bubbling. A proper simmer means occasional bubbles breaking the surface — if your lid is rattling, the heat is too high.',
      },
      {
        type: 'steps',
        title: 'The Correct Way to Sauté',
        items: [
          'Heat the pan first over medium-high heat for 1–2 minutes before adding fat. A properly preheated pan creates a non-stick surface even on stainless steel.',
          'Add fat and let it heat until shimmering (oil) or foaming subsides (butter) — this signals the fat is hot enough.',
          'Dry your food before adding it to the pan. Moisture on the surface of food creates steam, which lowers the pan temperature and prevents browning.',
          'Don\'t crowd the pan — food releases moisture as it cooks. Crowding means that moisture can\'t evaporate, so food steams instead of sears.',
          'Leave food undisturbed long enough to develop a crust — it will naturally release from the pan when it\'s ready to flip.',
        ],
      },
      {
        type: 'text',
        title: 'Choosing the Right Pan',
        body: 'Stainless steel is excellent for searing proteins and deglazing. Cast iron retains heat extremely well, making it ideal for searing steaks and baking cornbread. Non-stick is best for eggs and delicate fish. Carbon steel is the professional\'s choice — it combines the properties of both stainless and non-stick once properly seasoned. Avoid thin, flimsy pans — they create hot spots and warp under high heat.',
      },
      {
        type: 'callout',
        title: 'The Water Droplet Test',
        body: 'To check if your stainless steel pan is hot enough, flick a few drops of water in. If they sizzle and evaporate immediately, the pan is not hot enough. If they form a single, rolling ball that glides around the surface (the Leidenfrost effect), the pan is perfectly preheated and ready for fat.',
      },
    ],
  },
  {
    id: 'b6',
    readTime: '8 min read',
    sections: [
      {
        type: 'intro',
        body: 'Eggs are the perfect teaching ingredient. They are cheap, forgiving, and require mastery of almost every fundamental cooking technique: heat control, timing, fat management, and an understanding of protein coagulation. Gordon Ramsay famously uses scrambled eggs as his test for hiring cooks. Once you truly master eggs, you\'ve proved you understand heat.',
      },
      {
        type: 'steps',
        title: 'Perfect Scrambled Eggs (Low and Slow)',
        items: [
          'Crack 3 eggs directly into a cold non-stick or stainless pan — do not whisk separately.',
          'Add a knob of cold butter (about 1 tbsp) and place over low heat.',
          'Using a rubber spatula, stir continuously in figure-8 and sweeping motions — don\'t stop.',
          'Pull the pan off the heat every 30 seconds if the eggs are cooking too fast. The goal is small, soft, glossy curds — not large dry ones.',
          'Remove from heat just before they look fully done — residual heat will finish them.',
          'Finish with crème fraîche or cold butter, salt, and chives. Serve immediately on warm toast.',
        ],
      },
      {
        type: 'steps',
        title: 'Poached Eggs',
        items: [
          'Fill a wide saucepan with 3 inches of water. Add 1 tbsp white vinegar (this helps the whites coagulate faster).',
          'Bring to a gentle simmer — you want wisps of movement, not a boil.',
          'Crack each egg into a small ramekin or cup first — never directly into the pan.',
          'Create a gentle swirl in the water with a spoon, then slide the egg from the ramekin into the centre of the swirl.',
          'Cook for 3–4 minutes for a runny yolk. Remove with a slotted spoon and drain on kitchen paper.',
        ],
      },
      {
        type: 'text',
        title: 'Understanding Egg Proteins',
        body: 'Egg whites begin to set at 144°F (62°C) and become fully firm at 185°F (85°C). Yolks set at around 158°F (70°C). This is why temperature control matters so much — a few degrees separates runny, jammy, and hard-boiled. For a perfect soft-boiled egg, lower into boiling water and cook exactly 6½ minutes, then transfer to an ice bath immediately to stop cooking.',
      },
      {
        type: 'tips',
        title: 'Egg Tips',
        items: [
          'Room temperature eggs cook more evenly than cold eggs from the fridge.',
          'For a French omelette, use 3 eggs beaten smooth with a fork — no air bubbles — and cook quickly over medium-high heat with constant wrist movement on the pan.',
          'The fresher the egg, the better it poaches — older eggs have thinner whites that spread in the water.',
        ],
      },
    ],
  },
  {
    id: 'b7',
    readTime: '8 min read',
    sections: [
      {
        type: 'intro',
        body: 'Roasting is transformative — it takes raw, sometimes bland vegetables and concentrates their sugars, dries their surfaces, and creates deeply savoury, complex flavours through two chemical reactions: caramelisation and the Maillard reaction. Understanding why and how these reactions work makes you a better roaster every time.',
      },
      {
        type: 'text',
        title: 'Caramelisation vs. the Maillard Reaction',
        body: 'Caramelisation is the browning of sugar — it begins around 320°F (160°C) and produces sweet, nutty, complex flavours. The Maillard reaction is different: it\'s the browning of proteins and sugars together, beginning around 280°F (138°C), and produces hundreds of aromatic flavour compounds that are the foundation of roasted, seared, and baked foods. Both require dry heat and a dry surface — moisture is the enemy.',
      },
      {
        type: 'steps',
        title: 'The Roasting Formula',
        items: [
          'Preheat your oven to 400–425°F (200–220°C). Lower temperatures steam vegetables rather than roast them.',
          'Cut vegetables into uniform pieces — size determines cooking time. Inconsistent sizes mean some pieces burn while others are undercooked.',
          'Dry vegetables thoroughly. Pat with paper towels if they are wet or just washed.',
          'Toss with enough oil to coat every surface (usually 1–2 tbsp per pound), salt generously, and add spices.',
          'Spread in a single layer with space between pieces — crowding creates steam and prevents browning.',
          'Roast without touching for the first 15–20 minutes, then flip once when the bottom is deep golden-brown.',
        ],
      },
      {
        type: 'text',
        title: 'Timing by Vegetable',
        body: 'Dense root vegetables (carrots, beets, potatoes) need 35–45 minutes at 400°F. Brassicas (broccoli, cauliflower) take 20–25 minutes. Delicate vegetables (asparagus, cherry tomatoes, zucchini) need only 12–18 minutes. Garlic cloves roast in 25–30 minutes whole. When in doubt, cut smaller pieces rather than using higher heat — high heat without adequate time burns the outside before the inside cooks.',
      },
      {
        type: 'callout',
        title: 'Sheet Pan Secret',
        body: 'Use a heavy, rimmed sheet pan and line it with aluminium foil for easy cleanup. If you want maximum browning, skip the foil — parchment slightly reduces browning, and foil slightly increases it. Never use glass baking dishes for roasting vegetables; they retain moisture and cause steaming.',
      },
    ],
  },
  {
    id: 'b8',
    readTime: '8 min read',
    sections: [
      {
        type: 'intro',
        body: 'Rice, grains, and legumes form the caloric and nutritional backbone of almost every cuisine on earth. Yet they\'re among the most commonly overcooked or undercooked foods in home kitchens. The core issue is almost always the same: wrong liquid ratio, wrong heat, or lifting the lid too soon.',
      },
      {
        type: 'steps',
        title: 'Perfect White Rice (Absorption Method)',
        items: [
          'Rinse rice in cold water until the water runs clear — this removes surface starch that causes stickiness and gumminess.',
          'Use a 1:1.5 ratio of rice to water (1 cup rice to 1½ cups water) for long-grain rice. Short-grain and sushi rice use closer to 1:1.25.',
          'Bring to a boil uncovered, then reduce heat to the lowest setting and cover tightly.',
          'Cook for 18 minutes — do not lift the lid. The steam inside is doing the work.',
          'Remove from heat and let rest, still covered, for 10 minutes. This allows the steam to redistribute evenly.',
          'Fluff with a fork, never a spoon — a spoon compresses the grains.',
        ],
      },
      {
        type: 'text',
        title: 'Lentils and Legumes',
        body: 'Red lentils cook in 15–20 minutes and disintegrate into a silky purée — ideal for soups. Green and brown lentils hold their shape and take 25–35 minutes. Black lentils (beluga) are the firmest and most flavourful, taking 25–30 minutes. Unlike dried beans, lentils don\'t need soaking. Dried beans (chickpeas, black beans, kidney beans) benefit enormously from an overnight soak — it reduces cook time by 30% and improves digestibility. Never salt beans at the start of cooking; add salt in the last 10 minutes to prevent toughening.',
      },
      {
        type: 'steps',
        title: 'Toasting Grains for Flavour',
        items: [
          'Before adding liquid, place dry uncooked grains (rice, farro, quinoa, bulgur) in a dry pan over medium heat.',
          'Stir constantly for 2–4 minutes until the grains are fragrant and lightly golden.',
          'Then add liquid and proceed as normal. This step adds a distinct nuttiness that makes a remarkable difference.',
          'Quinoa in particular benefits from toasting — it removes its natural bitter saponin coating more effectively than rinsing alone.',
        ],
      },
    ],
  },
  {
    id: 'b9',
    readTime: '9 min read',
    sections: [
      {
        type: 'intro',
        body: 'A sauce is what separates a collection of ingredients from a cohesive dish. The good news is that great sauces don\'t require classical French training — they require understanding a few simple principles. The fond stuck to your pan after searing meat is arguably the most concentrated flavour in your kitchen.',
      },
      {
        type: 'steps',
        title: 'Pan Sauce (Deglazing)',
        items: [
          'After searing protein, remove it from the pan and set aside to rest.',
          'Pour off excess fat, leaving about 1 tbsp in the pan.',
          'Add aromatics (shallots, garlic) and cook over medium heat for 60 seconds.',
          'Add liquid — wine, stock, or a combination. The liquid will violently steam; use a wooden spoon to scrape up every brown bit from the bottom (this is the fond — pure concentrated flavour).',
          'Simmer until reduced by half, about 3–5 minutes.',
          'Remove from heat and swirl in cold butter 1 tbsp at a time to enrich and thicken. Taste, season, and pour over your rested protein.',
        ],
      },
      {
        type: 'text',
        title: 'The 3:1 Vinaigrette Ratio',
        body: 'A classic vinaigrette is 3 parts oil to 1 part acid. Start with the acid and season it with salt, mustard, and any flavourings — the mustard acts as an emulsifier, helping oil and water combine. Then slowly whisk in the oil in a thin stream. Taste and adjust: more acid for brightness, more oil for richness, more salt for depth. Add honey or maple syrup to balance sharp vinegars. This ratio works with any oil and any vinegar — master it and you\'ll never buy salad dressing again.',
      },
      {
        type: 'steps',
        title: 'Simple Yogurt-Based Sauces',
        items: [
          'Start with full-fat Greek yogurt as the base — it\'s thick enough to coat food and has enough fat to carry flavour.',
          'Add garlic (raw for punch, roasted for sweetness), fresh herbs (dill, mint, parsley), and lemon juice.',
          'Season aggressively — yogurt needs more salt than you\'d expect.',
          'Let sit for at least 30 minutes before serving so flavours can meld.',
        ],
      },
      {
        type: 'callout',
        title: 'Sauce-Thickening Methods',
        body: 'Reduction concentrates flavour by evaporating water. Butter mounting (monter au beurre) adds richness and a glossy sheen. A slurry of cornstarch and cold water thickens quickly without changing flavour. Pureeing a portion of the sauce itself thickens it using its own starches — great for soups and stews.',
      },
    ],
  },
  {
    id: 'b10',
    readTime: '10 min read',
    sections: [
      {
        type: 'intro',
        body: 'Executing a complete, balanced meal is the culmination of everything you\'ve learned. It\'s not about complexity — it\'s about orchestration. Professional chefs call it "getting the food out hot together," and it\'s a skill built on planning, timing, and trusting your foundational techniques.',
      },
      {
        type: 'steps',
        title: 'Planning Your First Complete Meal',
        items: [
          'Choose a protein, a starch, and a vegetable — this is the simplest balanced structure.',
          'Read all three recipes in full and identify which component takes longest (usually the protein or starch).',
          'Build a reverse timeline: if dinner is at 7pm and chicken takes 30 min, it goes in at 6:30. If rice takes 20 min, it starts at 6:40.',
          'Note components that can be prepared in advance: dressings, sauces, prepped vegetables, and marinades can all be done hours ahead.',
          'Set the table, prepare drinks, and check your ingredients before you start cooking — interruptions during cooking cause mistakes.',
        ],
      },
      {
        type: 'text',
        title: 'The Importance of Resting Proteins',
        body: 'Resting meat after cooking is non-negotiable. When protein is exposed to heat, muscle fibres contract and push moisture toward the centre. If you cut into it immediately, that moisture floods out onto the cutting board, leaving dry meat. Resting allows the fibres to relax and reabsorb moisture. Rest chicken pieces for 5 minutes, pork chops for 3–5 minutes, and a whole roast chicken for 15–20 minutes. Tent loosely with foil — not tightly, which creates steam and softens any crust.',
      },
      {
        type: 'steps',
        title: 'Basic Plating Principles',
        items: [
          'Use a warm plate — cold plates pull heat from food instantly. Warm them in a 200°F oven for 5 minutes.',
          'Plate the protein first as the visual anchor, then build components around it.',
          'Use odd numbers: 3 pieces of protein, 5 roasted vegetables, 1 dollop of sauce looks more natural than even numbers.',
          'Leave some white space on the plate — don\'t fill every inch. Negative space makes food look intentional.',
          'Wipe the rim of the plate with a clean cloth before serving.',
        ],
      },
      {
        type: 'callout',
        title: 'You\'re Ready',
        body: 'Complete this lesson and you\'ve built every foundational skill a home cook needs: a stocked kitchen, flavour intuition, knife control, recipe literacy, heat management, egg mastery, roasting technique, grain cooking, sauce making, and meal orchestration. The Intermediate section builds everything you learned here into professional-level technique.',
      },
    ],
  },

  // ─── INTERMEDIATE ─────────────────────────────────────────────────────────────
  {
    id: 'i1',
    readTime: '10 min read',
    sections: [
      {
        type: 'intro',
        body: 'Stock is the most fundamental preparation in classical cooking. Auguste Escoffier called it "the foundation of all culinary work." A good homemade stock transforms soups, sauces, and braises from flat to extraordinary — the difference is gelatin, extracted from bones over long, gentle cooking.',
      },
      {
        type: 'text',
        title: 'Stock vs. Broth',
        body: 'Stock is made primarily from bones, which contribute collagen. When collagen is heated slowly over many hours, it converts to gelatin — giving stock its body, richness, and the ability to set into a jelly when chilled. Broth is made from meat, which contributes flavour but little gelatin. A proper stock, when chilled, should set like loose Jello. If it stays liquid when cold, it needs longer cooking or more bones.',
      },
      {
        type: 'steps',
        title: 'Chicken Stock (The Essential Method)',
        items: [
          'Start with cold water — never hot. Cold water extracts proteins slowly, which rise to the surface as grey foam (impurities) and can be easily skimmed. Hot water traps these proteins in the liquid, creating a cloudy, muddy-tasting stock.',
          'Use a mix of bony parts for maximum gelatin: backs, necks, feet, and carcasses are far better than breast meat.',
          'Roast bones at 400°F for 30–40 minutes before making brown stock for a darker, more complex flavour.',
          'Add mirepoix (2 parts onion, 1 part carrot, 1 part celery by weight) and aromatics: bay leaves, thyme, peppercorns, parsley stems.',
          'Bring to a bare simmer — never a boil. Boiling creates a cloudy, harsh-tasting stock. Maintain 180–200°F for 4–6 hours for chicken, 8–12 for beef.',
          'Strain through a fine-mesh sieve without pressing the solids — pressing forces impurities back into your stock.',
          'Cool rapidly in an ice bath, then refrigerate. Skim the solidified fat from the top before using or freezing.',
        ],
      },
      {
        type: 'tips',
        title: 'Stock Tips',
        items: [
          'Save vegetable scraps (onion skins, carrot tops, celery leaves, mushroom stems) in a freezer bag and add them to stock.',
          'Never salt your stock — you control salt when you use it. An over-reduced salted stock becomes inedible.',
          'Stock freezes perfectly for 3 months. Freeze in ice cube trays for convenient small portions.',
          'Dashi — Japanese fish and kelp stock — takes 10 minutes and is the most flavour-efficient stock in any cuisine.',
        ],
      },
    ],
  },
  {
    id: 'i2',
    readTime: '10 min read',
    sections: [
      {
        type: 'intro',
        body: 'Braising is the technique of cooking tough, collagen-rich cuts of meat slowly in a small amount of liquid, covered, at low heat. It\'s the method that turns the cheapest cuts — chuck, short ribs, pork shoulder, lamb shanks — into the most luxurious dishes on any menu. The science involves collagen conversion and flavour concentration.',
      },
      {
        type: 'text',
        title: 'The Science of Braising',
        body: 'Tough cuts are tough because they come from heavily worked muscles with dense connective tissue made of collagen. At temperatures between 160–180°F (71–82°C), held for several hours, collagen converts into gelatin — a soft, silky molecule that dissolves into the braising liquid and creates that characteristic "melt in your mouth" texture. Higher heat (above 200°F) causes the muscle fibres to contract, squeeze out moisture, and toughen, which is why braising at too high a temperature makes meat dry and stringy.',
      },
      {
        type: 'steps',
        title: 'The Braising Method',
        items: [
          'Pat the protein completely dry and season generously — moisture prevents browning.',
          'Sear on all sides over high heat in a heavy pot (Dutch oven is ideal). This step builds the Maillard flavour foundation. Don\'t rush — proper searing takes 3–4 minutes per side.',
          'Remove the protein and build your braising base: brown aromatic vegetables (mirepoix) in the rendered fat, add tomato paste and cook it until brick-red (removes raw flavour), then deglaze with wine.',
          'Add stock until the liquid reaches halfway up the protein — not fully submerged. Fully submerging it makes a stew, not a braise. The exposed top cooks in steam.',
          'Cover tightly and cook in a 300°F (150°C) oven or over the lowest stovetop flame. Maintain a gentle simmer, not a boil.',
          'The braise is done when the meat yields easily to a fork but isn\'t falling apart. For short ribs, this is 3–4 hours. Chuck roast, 2–3 hours.',
          'Strain and reduce the braising liquid to a sauce consistency. It will be intensely flavoured — taste and balance with acid.',
        ],
      },
      {
        type: 'callout',
        title: 'Better the Next Day',
        body: 'Braises always taste better reheated the following day. Cooling allows the gelatin to set and flavours to meld. Reheat gently — never boil a braise or the meat will tighten. This makes braises the ideal dinner party dish: make it completely the day before and simply reheat.',
      },
    ],
  },
  {
    id: 'i3',
    readTime: '9 min read',
    sections: [
      {
        type: 'intro',
        body: '"Wok hei" — literally "breath of the wok" in Cantonese — is the smoky, complex, slightly charred flavour that distinguishes restaurant stir-fry from home stir-fry. It\'s produced by extremely high heat, rapid tossing, and controlled combustion of oil vapour. Achieving true wok hei at home is difficult, but understanding its principles makes every stir-fry significantly better.',
      },
      {
        type: 'text',
        title: 'Heat is Everything',
        body: 'Restaurant wok burners produce 150,000–200,000 BTUs of heat. A standard home burner produces 8,000–15,000 BTUs. This is why home stir-fry often steams instead of sears. The workaround: use a carbon steel or cast-iron wok, preheat it for 3–5 full minutes over your highest flame until smoking, cook in very small batches, and never add cold ingredients straight from the fridge. Every degree of temperature lost to cold ingredients costs you browning.',
      },
      {
        type: 'steps',
        title: 'Velveting: Restaurant Meat Technique',
        items: [
          'Slice protein thinly against the grain, about ¼ inch thick.',
          'Combine with 1 tbsp soy sauce, 1 tsp cornstarch, 1 tsp neutral oil, and optionally 1 tsp baking soda per 250g of meat.',
          'Baking soda raises the pH of the meat surface, inhibiting protein cross-linking — keeping the meat tender and preventing it from toughening under high heat.',
          'Marinate for 15–30 minutes at room temperature.',
          'For extra velveting: briefly poach the marinated protein in 160°F water or oil for 30 seconds before stir-frying.',
        ],
      },
      {
        type: 'steps',
        title: 'The Stir-Fry Order',
        items: [
          'Aromatics first (garlic, ginger, dried chillies) — cook for 15–30 seconds maximum, then remove.',
          'Protein — sear undisturbed for 30–60 seconds before tossing.',
          'Dense vegetables (broccoli, carrots, peppers) — add first among the vegetables.',
          'Tender vegetables (bok choy, snap peas, bean sprouts) — add last.',
          'Sauce — pour around the perimeter of the wok, not directly on food, so it hits the hot wok surface and flashes.',
          'Aromatics back in — stir to combine and serve immediately.',
        ],
      },
    ],
  },
  {
    id: 'i4',
    readTime: '11 min read',
    sections: [
      {
        type: 'intro',
        body: 'Fresh pasta is an exercise in understanding gluten — the protein network that gives dough its structure, elasticity, and chew. There are only two or three ingredients, but the ratio, flour type, and technique determine everything. Once you\'ve made pasta by hand, dried pasta will feel like a different food.',
      },
      {
        type: 'text',
        title: 'Flour Types',
        body: '"00" flour (doppio zero) is finely milled Italian flour with a protein content of 9–12%. Its fine milling allows it to hydrate quickly and produce a silky, smooth dough that\'s easier to roll thin. Semolina flour is coarser with higher protein (12–13%), producing a chewier, more textured pasta. Classic egg pasta uses 00 or all-purpose flour. Southern Italian dried pasta shapes (orecchiette, cavatelli) often use semolina and water only — no eggs. The golden rule: the thinner you want to roll it, the finer the flour should be.',
      },
      {
        type: 'steps',
        title: 'Basic Egg Pasta Dough',
        items: [
          'Use 100g of 00 flour per egg yolk as a starting ratio. For 2 servings: 200g flour, 2 whole eggs, 2 extra yolks (extra yolks add richness and colour).',
          'Mound flour on a clean surface, make a well in the centre, and crack eggs into the well.',
          'Using a fork, beat the eggs while gradually incorporating flour from the inner walls of the well — don\'t break the wall.',
          'Once too thick for a fork, use your hands and a bench scraper to bring it together into a shaggy mass.',
          'Knead for 8–10 minutes until smooth, elastic, and slightly tacky but not sticky. The dough should spring back slowly when poked.',
          'Wrap in plastic and rest at room temperature for 30 minutes minimum — resting relaxes the gluten and makes rolling dramatically easier.',
          'Roll through a pasta machine starting at the widest setting, folding and repeating 2–3 times before progressively thinning.',
        ],
      },
      {
        type: 'tips',
        title: 'Pasta Tips',
        items: [
          'If the dough tears when rolling, it needs more rest. Gluten is too tight — let it relax for 10 more minutes.',
          'Pasta cooks very quickly when fresh — 60 to 90 seconds in well-salted boiling water.',
          'Salt pasta water until it "tastes like the sea" — this is the only opportunity to season the pasta itself.',
          'Fresh pasta freezes beautifully raw: dust with semolina, nest into portions, freeze on a sheet pan, then bag.',
        ],
      },
    ],
  },
  {
    id: 'i5',
    readTime: '8 min read',
    sections: [
      {
        type: 'intro',
        body: 'Seasoning is the most practised skill in professional kitchens and the most neglected skill in home kitchens. It\'s not about adding salt — it\'s about understanding where flavour lives, how it changes during cooking, and how to use multiple tools to build complexity. A properly seasoned dish is not salty; it\'s complete.',
      },
      {
        type: 'text',
        title: 'Seasoning in Layers',
        body: 'Professional cooks season at every stage of cooking, not just at the end. Season aromatics when they go in — this draws out moisture and starts building base flavour. Season proteins before and during cooking. Season vegetables before roasting or sautéing. Season stocks and sauces as they reduce. Taste after every addition of a new ingredient and adjust. By the time a dish is plated, it has been seasoned 4–6 times — each layer building on the last.',
      },
      {
        type: 'steps',
        title: 'Types of Salt and When to Use Them',
        items: [
          'Kosher salt (Diamond Crystal or Morton): the standard cooking salt. Its coarse crystals are easy to feel and control with your fingers. Use for seasoning during cooking.',
          'Fine sea salt: more consistent grain size than kosher, ideal for baking where precision matters.',
          'Flaky sea salt (Maldon, Fleur de Sel): delicate, irregular crystals with a clean mineral flavour. Use only as a finishing salt on plates — heat and moisture dissolve its beautiful texture.',
          'Soy sauce and miso: umami-rich forms of salt. Use them to season braises, marinades, and dressings for depth.',
          'Preserved lemons and fish sauce: fermented salty-acid combinations that add complexity far beyond plain salt.',
        ],
      },
      {
        type: 'callout',
        title: 'Acid is the Other Seasoning',
        body: 'Many dishes that taste "under-seasoned" are actually under-acidified. Before reaching for salt, squeeze lemon, add a splash of vinegar, or stir in a spoon of yogurt. Acid heightens perception of all other flavours, reduces bitterness, and makes food taste brighter and more alive. Use both together — they\'re partners, not substitutes.',
      },
    ],
  },
  {
    id: 'i6',
    readTime: '9 min read',
    sections: [
      {
        type: 'intro',
        body: 'Fish and seafood are among the most rewarding and most commonly overcooked foods in any kitchen. The margin between perfectly cooked and dry, rubbery, or tasteless is narrow — often just 30 seconds. Understanding the protein structure of fish and the visual cues for doneness solves this permanently.',
      },
      {
        type: 'text',
        title: 'Why Fish Overcooks So Easily',
        body: 'Fish muscle fibres are shorter and more delicate than those of land animals, and their connective tissue is almost entirely collagen that melts at much lower temperatures (around 130°F/54°C). Fish is done — and beginning to overcook — at an internal temperature of 125–135°F (52–57°C) for most species. This compares to chicken at 165°F. The window between "just done" and "overcooked" is approximately 5–10°F, which is why timing and an instant-read thermometer are essential.',
      },
      {
        type: 'steps',
        title: 'Pan-Searing Fish with Crispy Skin',
        items: [
          'Score the skin lightly with a knife 2–3 times to prevent curling.',
          'Pat the fillet completely dry — moisture creates steam and prevents crisping.',
          'Season skin side only with salt just before cooking (seasoning too early draws moisture).',
          'Heat a stainless or carbon steel pan over medium-high heat until very hot. Add a neutral oil.',
          'Place fish skin-side down and immediately press flat with a spatula for 10 seconds to prevent curling.',
          'Cook skin-side down for 70–80% of the total cooking time. The flesh will turn opaque from the bottom upward.',
          'Flip only once, cook for 30–60 seconds on the flesh side, baste with butter and herbs, and serve immediately.',
        ],
      },
      {
        type: 'tips',
        title: 'Seafood Quick Guide',
        items: [
          'Shrimp: sear in a single layer over high heat, 90 seconds per side. They\'re done when fully pink and curled into a loose "C" — an "O" shape means overcooked.',
          'Scallops: must be very dry before cooking. Sear in a screaming hot pan with oil — 90 seconds per side, undisturbed. A golden crust is the goal.',
          'Salmon: best served medium (125°F internally) — the fat between the flakes should look just barely opaque.',
          'Whole fish: bake at 400°F for 10 minutes per inch of thickness at the thickest point.',
        ],
      },
    ],
  },
  {
    id: 'i7',
    readTime: '11 min read',
    sections: [
      {
        type: 'intro',
        body: 'Bread is the oldest prepared food in human history and the most scientifically complex baking project a home cook can undertake. It requires understanding yeast biology, gluten chemistry, fermentation, and heat dynamics. But once the principles click, you can bake bread from memory — and adjust intuitively when something is off.',
      },
      {
        type: 'text',
        title: 'Yeast: The Living Engine',
        body: 'Yeast is a living organism that consumes sugars and produces CO₂ (which inflates gluten into bubbles) and alcohol (which contributes flavour). Active dry yeast must be "proofed" in warm water (100–110°F/38–43°C) before using — water that\'s too hot kills it, too cold and it won\'t activate. Instant yeast can be added directly to dry ingredients. Wild yeast (sourdough starter) ferments more slowly and produces lactic and acetic acids, giving sourdough its tang.',
      },
      {
        type: 'steps',
        title: 'The Windowpane Test',
        items: [
          'After kneading, take a small piece of dough and gently stretch it between your fingers.',
          'If it tears immediately, gluten is underdeveloped — knead more.',
          'If you can stretch it into a thin, translucent membrane through which you can almost see light, the gluten network is fully developed.',
          'This test works because fully-developed gluten forms long, interconnected chains that stretch without breaking.',
        ],
      },
      {
        type: 'steps',
        title: 'Bulk Fermentation and Proofing',
        items: [
          'Bulk fermentation (first rise): shaped dough doubles in size, typically 1–2 hours at room temperature. During this phase, yeast produces CO₂ and flavour compounds. Longer, cooler fermentation (overnight in the fridge) produces more complex flavour.',
          'Shape: punch down gently to degas, then shape. Shaping creates surface tension that helps the loaf hold its structure during the second rise.',
          'Proofing (second rise): 30–60 minutes until dough springs back slowly when poked but doesn\'t fully spring back (finger poke test).',
          'Bake in a Dutch oven with the lid on for the first 20 minutes — the trapped steam keeps the crust supple, allowing maximum oven spring. Remove lid for the final 15–20 minutes to brown and crisp.',
        ],
      },
      {
        type: 'callout',
        title: 'The Dutch Oven Secret',
        body: 'Professional bakers use steam-injected ovens to achieve an open crumb and crackling crust. At home, a preheated covered Dutch oven replicates this perfectly. The steam from the dough itself is trapped, keeping the crust soft enough to expand fully before it sets. This is responsible for the "ear" (the raised ridge along a scored loaf) that defines artisan bread.',
      },
    ],
  },
  {
    id: 'i8',
    readTime: '10 min read',
    sections: [
      {
        type: 'intro',
        body: 'An emulsion is a mixture of two immiscible liquids — usually oil and water — that are forced to coexist using an emulsifier. Mayonnaise, hollandaise, and vinaigrette are all emulsions. Mastering emulsification means mastering richness, texture, and stability — and knowing how to rescue a sauce that "breaks."',
      },
      {
        type: 'text',
        title: 'How Emulsification Works',
        body: 'Oil and water don\'t naturally mix because oil molecules are nonpolar and water molecules are polar. An emulsifier bridges this gap: it has a hydrophilic (water-loving) head and a lipophilic (fat-loving) tail. Lecithin in egg yolks is the most commonly used emulsifier in cooking. It surrounds oil droplets and suspends them evenly in the water phase, creating a stable, homogenous mixture. The more vigorously you whisk or blend, the smaller the oil droplets become, and the more stable and thick the emulsion.',
      },
      {
        type: 'steps',
        title: 'Hollandaise Sauce',
        items: [
          'In a heatproof bowl over barely simmering water (double boiler), whisk 3 egg yolks with 1 tbsp water until pale and ribbon-like — the yolks must be partially cooked to thicken.',
          'Remove from heat and begin adding clarified butter in a thin, steady stream while whisking constantly.',
          'The key is temperature: yolks must be warm enough to emulsify but never above 160°F — above that, they scramble.',
          'Season with lemon juice, cayenne, and salt. The sauce should coat the back of a spoon and hold a line drawn through it.',
          'If the sauce breaks (separates into greasy pools), start a new yolk in a clean bowl and slowly whisk the broken sauce into it — the new yolk re-emulsifies everything.',
        ],
      },
      {
        type: 'tips',
        title: 'Emulsion Tips',
        items: [
          'For mayonnaise, start with room temperature ingredients — cold oil thickens too slowly and can prevent the emulsion from forming.',
          'Adding mustard to vinaigrette provides extra emulsification and keeps it together longer in the fridge.',
          'A broken butter sauce can often be saved by adding a splash of cold water and whisking vigorously.',
          'Butter itself is a natural emulsion of water, fat, and milk proteins — which is why it creates such rich, glossy pan sauces.',
        ],
      },
    ],
  },
  {
    id: 'i9',
    readTime: '9 min read',
    sections: [
      {
        type: 'intro',
        body: 'Fermentation is one of the oldest food preservation techniques in human history — and one of the most misunderstood. Far from being dangerous or difficult, lacto-fermentation is among the safest food transformations that exists: the acid produced by bacteria kills harmful pathogens. You\'ve been eating fermented foods your whole life: yogurt, cheese, wine, beer, sourdough, pickles, soy sauce, and kimchi are all fermented.',
      },
      {
        type: 'text',
        title: 'Lacto-Fermentation vs. Vinegar Pickling',
        body: 'Quick pickling uses vinegar (already acidic) to preserve food and takes hours to days. Lacto-fermentation uses naturally occurring Lactobacillus bacteria on vegetable surfaces to produce lactic acid from sugars — creating acidity over days to weeks. Lacto-fermented vegetables have a more complex, nuanced flavour, retain more nutrients, and contain live probiotic bacteria. Both are valid, but lacto-fermentation produces flavours that vinegar pickling cannot replicate.',
      },
      {
        type: 'steps',
        title: 'Basic Lacto-Fermentation Brine',
        items: [
          'Use a 2–3% salt brine by weight: 20–30g kosher or sea salt per 1 litre of water.',
          'Never use iodised table salt — iodine inhibits the bacteria needed for fermentation.',
          'Pack vegetables tightly into clean glass jars, leaving 1 inch of headspace.',
          'Pour brine over vegetables ensuring everything is submerged — oxygen exposure causes mould.',
          'Use a smaller jar or zip-lock bag filled with brine as a weight to keep vegetables below the liquid surface.',
          'Cover loosely (to allow CO₂ to escape) and leave at room temperature (65–75°F) for 3–7 days, tasting daily.',
          'When sour enough, seal and refrigerate to slow fermentation.',
        ],
      },
      {
        type: 'tips',
        title: 'Fermentation Tips',
        items: [
          'Kimchi: massage napa cabbage with salt, rinse, combine with gochugaru (Korean chilli flakes), fish sauce, garlic, ginger, and green onions. Ferment 1–5 days.',
          'Any white foam (kahm yeast) on the surface is harmless — scrape it off and ensure vegetables remain submerged.',
          'Colour change is normal: vegetables will dull as chlorophyll degrades. Flavour, not appearance, determines doneness.',
          'The colder the fermentation environment, the slower and more complex the flavour development.',
        ],
      },
    ],
  },
  {
    id: 'i10',
    readTime: '9 min read',
    sections: [
      {
        type: 'intro',
        body: 'Mise en place — French for "everything in its place" — is the system of organisation used by professional kitchens worldwide. It is simultaneously a physical practice (prepping and organising before service) and a philosophical mindset (mental preparation, anticipation, and discipline). Adopting it transforms home cooking from reactive to intentional.',
      },
      {
        type: 'steps',
        title: 'The Professional Prep System',
        items: [
          'Read the full recipe or menu plan. Identify every ingredient and technique required.',
          'Gather all equipment and place it within arm\'s reach of your working station.',
          'Prepare ingredients in order of their cook time: longest-cooking items are prepped first.',
          'Place each prepped ingredient in a small bowl, ramekin, or container labelled and arranged in the order you\'ll use it.',
          'Measure spices, sauces, and liquids in advance and group them by stage of the recipe.',
          'Set a timer for each component — manage time proactively, not reactively.',
        ],
      },
      {
        type: 'text',
        title: 'Cross-Utilisation: Cooking Like a Restaurant',
        body: 'Restaurant menus are engineered for cross-utilisation: the same braised short rib appears as a pasta filling, a taco protein, and a main course. The herb oil for the fish also garnishes the soup. This reduces waste and prep time. At home, apply the same thinking: roast a large tray of vegetables on Sunday and use them across three meals. Make a double batch of vinaigrette. Render bacon fat and use it to season three dishes. Cook once, eat many times.',
      },
      {
        type: 'callout',
        title: 'The 10-Minute Rule',
        body: 'Before any cooking session, spend 10 minutes reading, organising, and prepping. This investment saves 30+ minutes of confusion during cooking, prevents burned garlic while you\'re still searching for the cumin, and makes the cooking experience enjoyable rather than stressful. The 10 minutes of mise en place is always worth it.',
      },
    ],
  },

  // ─── ADVANCED ─────────────────────────────────────────────────────────────────
  {
    id: 'a1',
    readTime: '12 min read',
    sections: [
      {
        type: 'intro',
        body: 'The five French mother sauces, codified by Auguste Escoffier in the early 20th century, are the foundation from which hundreds of classical sauces derive. Mastering them is not about memorising recipes — it\'s about understanding the structural logic: each mother sauce has a liquid base and a thickening agent, and each produces a family of child sauces through simple additions.',
      },
      {
        type: 'steps',
        title: 'The Five Mother Sauces',
        items: [
          'Béchamel: whole milk + white roux (equal parts butter and flour cooked together). The roux is cooked briefly to remove the raw flour taste. Key derivatives: Mornay (+ cheese), Soubise (+ onion purée), Nantua (+ crayfish butter).',
          'Velouté: light stock (chicken, veal, or fish) + blonde roux. More flavourful than béchamel due to the stock base. Key derivatives: Suprême (+ cream), Allemande (+ egg yolk liaison), Normande (fish velouté + cream + mushrooms).',
          'Espagnole (Brown Sauce): brown beef stock + dark roux + tomato + mirepoix. The dark roux is cooked to a rich brown, adding a nutty depth. Key derivative: Demi-glace (espagnole + equal parts brown stock, reduced by half) — the gold standard of classical sauces.',
          'Sauce Tomat: tomatoes + pork belly + mirepoix + brown stock. More complex than simple tomato sauce, with a deeper, meatier foundation.',
          'Hollandaise: egg yolk emulsion + clarified butter + lemon. The only cold-start mother sauce. Key derivatives: Béarnaise (+ tarragon and shallot reduction), Maltaise (+ blood orange juice), Mousseline (+ whipped cream).',
        ],
      },
      {
        type: 'text',
        title: 'The Roux: Foundation of Three Mothers',
        body: 'A roux is equal weights of fat (usually butter) and flour cooked together. It thickens sauces by suspending starch granules in fat, which then absorb liquid evenly without lumping. A white roux is cooked 2–3 minutes — still pale, used for béchamel. A blonde roux cooks 5–7 minutes to a golden colour — used for velouté. A dark (brown) roux cooks 10–15 minutes until deep mahogany — used for espagnole. The longer a roux cooks, the darker its colour, the nuttier its flavour, and the weaker its thickening power (starch breaks down with prolonged heat).',
      },
      {
        type: 'callout',
        title: 'Why Demi-Glace Matters',
        body: 'Demi-glace — espagnole reduced with stock to a syrupy consistency — is the backbone of classical French cuisine. A single spoon stirred into a pan sauce transforms it. A quality demi-glace can be portioned and frozen; add a cube to any red meat dish for restaurant-level depth. Modern kitchens often replace it with reduced, unsalted veal or beef stock, but the principle is the same: extreme concentration of collagen and flavour.',
      },
    ],
  },
  {
    id: 'a2',
    readTime: '10 min read',
    sections: [
      {
        type: 'intro',
        body: 'Sous vide — French for "under vacuum" — is the technique of cooking food sealed in a bag, submerged in a precisely temperature-controlled water bath. It was developed in the 1970s by French chef Georges Pralus and scientist Bruno Goussault, who used it to cook foie gras without losing fat. Today it\'s standard in professional kitchens and accessible to home cooks through affordable immersion circulators.',
      },
      {
        type: 'text',
        title: 'Why Precision Temperature Matters',
        body: 'Conventional cooking relies on high heat (oven, pan) to reach the interior temperature you want — but because the exterior is far hotter than the interior, there\'s an inevitable gradient from overcooked outside to correctly-cooked centre. Sous vide eliminates this gradient by setting the water bath to exactly the final temperature you want. A steak cooked at 130°F (54°C) will be exactly medium-rare from edge to edge — it is physically impossible to overcook it as long as the bath stays at 130°F. The only question is time.',
      },
      {
        type: 'steps',
        title: 'Sous Vide: Core Method',
        items: [
          'Season protein and seal in a zip-lock bag using the water displacement method (submerge bag in water to push air out, then seal) or a vacuum sealer.',
          'Set the immersion circulator to your target temperature (see below for key temps).',
          'Cook for the specified time — sous vide is highly forgiving on time (within limits); an extra 30 minutes rarely matters.',
          'Remove from bag, pat completely dry — surface moisture prevents searing.',
          'Sear in a screaming hot cast-iron pan with high smoke-point oil for 45–60 seconds per side. The goal is a crust, not heat penetration — the protein is already cooked.',
          'Rest for 5 minutes and serve immediately.',
        ],
      },
      {
        type: 'steps',
        title: 'Key Temperature Reference',
        items: [
          'Chicken breast: 140°F (60°C) for 1–4 hours — impossibly juicy, safely pasteurised at this lower temperature.',
          'Steak (medium-rare): 130°F (54°C) for 1–4 hours.',
          'Pork loin: 140°F (60°C) for 1–4 hours — no longer needs to be cooked to 160°F.',
          'Salmon (silky): 122°F (50°C) for 30–45 minutes.',
          'Eggs (custard-like yolk): 147°F (64°C) for 1 hour — the "63-degree egg" of Japanese ramen.',
          'Carrots and root vegetables: 183°F (84°C) for 1–2 hours — fully cooked in their own juices.',
        ],
      },
    ],
  },
  {
    id: 'a3',
    readTime: '12 min read',
    sections: [
      {
        type: 'intro',
        body: 'Baking is chemistry made edible. Unlike cooking, where intuition guides most decisions, baking is precise and predictable — when you understand what each ingredient actually does at a molecular level. The "why" behind butter, sugar, eggs, and flour unlocks the ability to troubleshoot any failed bake and to create new recipes from first principles.',
      },
      {
        type: 'text',
        title: 'The Role of Butter',
        body: 'Butter is 80% fat, 18% water, and 2% milk solids. In pastry, how you use butter determines texture. Cold butter (cut into flour): the fat coats flour particles, inhibiting full gluten development, and the water creates steam during baking — producing flaky layers (pie crust, croissants, scones). Melted butter: mixes fully into the batter, producing dense, moist, chewy textures (brownies, muffins). Creamed butter: beaten with sugar traps air bubbles in the fat, which expand during baking, producing a light, tender crumb (cakes). Temperature is the variable that controls everything.',
      },
      {
        type: 'text',
        title: 'Sugar\'s Many Roles',
        body: 'Sugar does far more than sweeten. It retains moisture (hygroscopic), extending shelf life. It weakens gluten by competing with flour proteins for water, producing tender crumbs. It browns via the Maillard reaction and caramelisation, creating colour and hundreds of flavour compounds. It affects spread: more sugar in cookies = more spread. Different sugars behave differently: brown sugar contains molasses (adds moisture and flavour), powdered sugar dissolves instantly (good for icings), and honey and maple syrup are liquid sugars with their own distinct browning properties.',
      },
      {
        type: 'steps',
        title: 'Laminated Doughs: How Croissants Work',
        items: [
          'Start with a yeast-leavened détrempe (base dough) that is mixed briefly — minimal gluten development at this stage.',
          'Create a beurrage: a flat, pliable slab of cold butter beaten to the same plasticity as the dough.',
          'Enclose the butter in the dough and begin rolling and folding: each fold doubles the number of butter layers.',
          'A classic croissant uses 27 layers from 3 double folds ("book folds") or the equivalent using single turns.',
          'Between each fold, rest the dough in the refrigerator for 30 minutes — this chills the butter, which prevents it from melting into the dough.',
          'The result: hundreds of alternating layers of dough and butter that separate during baking as the butter\'s water turns to steam.',
        ],
      },
      {
        type: 'callout',
        title: 'Baking Temperature Logic',
        body: 'Ovens have hot spots and many run hot or cool. An oven thermometer (not the dial) is essential for precise baking. Most ovens read 25–50°F off. High temperatures (375°F+) brown the exterior quickly and create steam rapidly — good for crusty bread, caramelised pastry tops, and cookies with crisp edges. Lower temperatures (300–325°F) allow moisture to evaporate gently without burning, producing an even crumb in cheesecakes, custards, and delicate cakes.',
      },
    ],
  },
  {
    id: 'a4',
    readTime: '11 min read',
    sections: [
      {
        type: 'intro',
        body: 'Understanding how to break down whole proteins is a skill that dramatically reduces food costs, wastes nothing, and deepens your understanding of flavour. A whole chicken costs a third the price of pre-cut pieces. A pork shoulder from a butcher costs half the price of pre-portioned chops. Butchery knowledge also tells you what each muscle does — and therefore how to cook it.',
      },
      {
        type: 'steps',
        title: 'Breaking Down a Whole Chicken',
        items: [
          'Remove the legs: cut through the skin between the thigh and body, bend the leg outward to pop the hip joint, then cut through the joint — never through bone.',
          'Separate thigh from drumstick: find the fat line on the underside of the leg and cut through the joint directly beneath it.',
          'Remove the wings: cut through the shoulder joint where the wing meets the breast.',
          'Remove the backbone: using kitchen shears or a boning knife along either side of the spine. Reserve for stock.',
          'Split the breast in half: cut through the centre cartilage (not the bone) with a sharp knife, then through any remaining cartilage.',
          'You now have 8 pieces: 2 drumsticks, 2 thighs, 2 wings, 2 breast halves — plus a backbone for stock.',
        ],
      },
      {
        type: 'text',
        title: 'Understanding Muscle and Cooking Method',
        body: 'Muscles that work hardest are toughest and most flavourful — they require low-and-slow cooking to break down collagen. Muscles that are used less are tender but milder — they benefit from quick, high-heat cooking. In a chicken: legs and thighs (constantly working) = braise or roast low. Breasts (less active) = roast high-heat, poach, or sear carefully. In beef: shank and brisket = braise. Chuck = braise or grind. Rib and loin (minimal movement) = grill or roast. Understanding this principle means you can select the right cooking method without memorising every cut.',
      },
      {
        type: 'tips',
        title: 'Butchery Tips',
        items: [
          'Always cut through joints, not through bone — find the joint by bending the limb and feeling where it gives.',
          'A boning knife has a thin, flexible blade specifically designed for working around bones without waste.',
          'Freeze partially (30 min) before slicing very thin cuts — partially frozen meat holds its shape under the knife.',
          'Bones, skin, and trimmings are not waste — they are stock. Never discard them.',
        ],
      },
    ],
  },
  {
    id: 'a5',
    readTime: '9 min read',
    sections: [
      {
        type: 'intro',
        body: 'Plating is the visual language of cooking. Before a single bite is taken, the plate communicates the cook\'s intention, skill, and care. Restaurant chefs study visual composition the way designers study graphic layout — understanding geometry, colour theory, negative space, and texture contrast. These principles are not about being precious; they\'re about enhancing the eating experience.',
      },
      {
        type: 'text',
        title: 'Composition Principles',
        body: 'The rule of thirds applies to plating as it does to photography: divide the plate into thirds mentally and place the primary element (protein) at one of the intersection points, not the centre. Odd numbers (3 pieces of protein, 5 garnish dots) read as more natural and dynamic than even numbers. Height creates visual interest — build upward using a starch base, then protein, then garnish. Never cover the plate completely; negative space (empty plate visible) makes food look considered rather than abundant.',
      },
      {
        type: 'steps',
        title: 'Saucing Techniques',
        items: [
          'The smear: pool sauce at the centre of the plate and drag the back of a spoon through it in one deliberate motion. Thickness and speed determine the shape.',
          'The dot: use a squeeze bottle to place precise dots of sauce in a line or arc.',
          'The puddle: spoon sauce into the centre of the plate and gently tilt to distribute — classic for lighter sauces under fish.',
          'Never place sauce on top of a crispy element — it softens the crust immediately.',
          'Warm the plate and add sauce last before serving — cold sauce on a warm plate dulls both the flavour and appearance.',
        ],
      },
      {
        type: 'tips',
        title: 'Professional Plating Habits',
        items: [
          'Wipe the rim of every plate with a clean, damp cloth before service.',
          'Use tweezers (culinary or cosmetic) for precise placement of microgreens, herbs, and garnishes.',
          'Height is created with food, not with towers that fall apart when cut.',
          'Colour contrast: a monochromatic plate (all beige) is visually unappealing regardless of taste — add a fresh herb, a jewel of pomegranate, or a bright acid-dressed element.',
          'Every element on the plate must be edible and must contribute flavour — purely decorative garnishes are a remnant of 1980s cooking.',
        ],
      },
    ],
  },
  {
    id: 'a6',
    readTime: '10 min read',
    sections: [
      {
        type: 'intro',
        body: 'Flavour pairing is the application of food science to culinary creativity. The Flavour Pairing Theory, popularised by chef Heston Blumenthal and scientist François Benzi, proposes that ingredients sharing key volatile aroma compounds taste good together — even when the pairing seems counterintuitive. This is why coffee and garlic, banana and parsley, or strawberry and black pepper work so well.',
      },
      {
        type: 'text',
        title: 'Fat-Soluble vs. Water-Soluble Flavours',
        body: 'Most aroma compounds are fat-soluble — they dissolve in and are carried by fat, reaching your olfactory receptors more efficiently. This is why cooking garlic and spices in oil releases far more aroma than adding them to water-based sauces. Water-soluble compounds (like those in fresh herbs added at the end) are volatile and fleeting — they evaporate quickly when heated, which is why herbs added at the start of cooking lose most of their flavour. Layer: fat-soluble spices and aromatics go in early with oil; water-soluble fresh herbs go in at the end.',
      },
      {
        type: 'steps',
        title: 'Building Umami Depth',
        items: [
          'Umami is the fifth taste, produced by glutamate molecules. It creates savouriness, complexity, and the sensation that a dish "stays on the palate."',
          'Glutamate-rich ingredients: aged Parmesan, soy sauce, miso, fish sauce, anchovies, sun-dried tomatoes, mushrooms (especially dried), and meat fond.',
          'Stacking umami: combining multiple glutamate sources creates exponential flavour. Pasta with anchovies, Parmesan, and sun-dried tomatoes is deeply savoury despite minimal effort.',
          'Inosinate and guanylate synergy: when glutamate is combined with inosinate (found in meat and fish) or guanylate (found in dried mushrooms), the umami effect is multiplied up to 8× — the principle behind dashi (kombu + bonito flakes).',
        ],
      },
      {
        type: 'callout',
        title: 'The Contrast Principle',
        body: 'Great dishes are built on contrast, not similarity. Sweet and salty (salted caramel). Rich and acidic (foie gras with balsamic). Creamy and crunchy (silky mousse with praline). Hot and cool (spicy curry with raita). Every element on the plate should contrast with at least one other — in texture, temperature, flavour, or colour. Dishes that are entirely rich, entirely sweet, or entirely soft are one-dimensional and become monotonous before the plate is finished.',
      },
    ],
  },
  {
    id: 'a7',
    readTime: '12 min read',
    sections: [
      {
        type: 'intro',
        body: 'Every major cuisine is a codified system of techniques, flavour principles, and cultural logic. Learning to cook authentically from different culinary traditions doesn\'t just expand your repertoire — it teaches you new ways of thinking about heat, seasoning, and flavour construction that fundamentally improve your cooking across every cuisine.',
      },
      {
        type: 'text',
        title: 'Japanese Cuisine: Dashi and Umami',
        body: 'Japanese cuisine is built on dashi — a broth made by steeping kombu (dried kelp) in cold water and briefly simmering with katsuobushi (dried fermented bonito flakes). This 10-minute preparation is extraordinary in its flavour efficiency, producing an intensely savoury, delicate base for miso soup, noodle broths, and braises. The genius of Japanese seasoning is restraint: soy sauce, mirin, sake, and dashi in varying ratios produce most of the cuisine\'s flavour profiles. Technique is expressed through knife work (katsuramuki — the paper-thin continuous vegetable peel), temperature precision (resting times, tempura batter temperature), and aesthetics.',
      },
      {
        type: 'text',
        title: 'Mexican Cuisine: Chilli Intelligence and Mole',
        body: 'Mexican cooking is built on three pillars: the dried chilli, the fresh chilli, and corn. Dried chillies — ancho, mulato, pasilla, chipotle — are smoky, complex, and far less hot than their fresh counterparts. Each variety contributes distinct flavour: ancho is fruity and sweet; chipotle is smoky; guajillo is bright and tannic. A mole negro uses 30+ ingredients across hours of layered cooking: toasted and rehydrated dried chillies, charred tomatoes and tomatillos, toasted nuts and seeds, charred onion and garlic, fried tortilla, banana, and a small piece of dark chocolate — each ingredient adding one thread to an irreducible complexity.',
      },
      {
        type: 'text',
        title: 'Indian Cuisine: The Spice Bloom',
        body: 'Indian cooking begins with the tadka (or tarka): whole spices (mustard seeds, cumin seeds, dried chillies, curry leaves) added to very hot fat and cooked for 30–60 seconds until they pop and bloom. Blooming releases fat-soluble aroma compounds that would otherwise remain locked in the spice. Ground spices are added to the hot fat and cooked — not just stirred in — for 2–3 minutes to eliminate their raw, harsh edge and develop their flavour. Onions in Indian cooking are cooked far longer than in Western cuisine: 20–30 minutes to a deep golden-brown, creating the sweet, jammy base that defines the cuisine\'s flavour depth.',
      },
      {
        type: 'tips',
        title: 'Cross-Cultural Techniques to Adopt',
        items: [
          'Japanese: the "rest before serving" principle — food resting for 2–5 minutes after cooking improves both flavour and texture.',
          'Mexican: charring aromatics (tomatoes, onions, garlic directly over flame or under broiler) before using them adds a smoky complexity absent from raw or sautéed aromatics.',
          'Indian: always bloom whole spices in fat at the start of cooking — this single step transforms the flavour of any oil-based dish.',
          'French: mount every pan sauce with cold butter off heat — this emulsification adds richness and gloss that stock alone can\'t achieve.',
        ],
      },
    ],
  },
  {
    id: 'a8',
    readTime: '11 min read',
    sections: [
      {
        type: 'intro',
        body: 'Molecular gastronomy applies food science and chemistry to create textures, presentations, and flavour experiences that traditional cooking techniques cannot achieve. Pioneered by Ferran Adrià at El Bulli and Heston Blumenthal at The Fat Duck, these techniques are now used selectively in creative restaurants worldwide. They are not gimmicks — at their best, they serve flavour and experience in ways that conventional cooking cannot.',
      },
      {
        type: 'steps',
        title: 'Spherification',
        items: [
          'Basic spherification creates a thin gel membrane around a liquid, producing a flavour "bubble" that bursts in the mouth.',
          'Combine your flavoured liquid with 0.5% sodium alginate by weight (e.g., 5g per 1 litre) using a blender. Rest in the fridge 30 minutes to remove air bubbles.',
          'Prepare a calcium chloride bath: 5g per 1 litre of water.',
          'Drop the alginate liquid into the calcium bath using a spoon or syringe. Gel forms on contact in 60–90 seconds.',
          'Rinse in clean water and serve immediately — the spheres continue to gel from the inside out over time.',
          'Reverse spherification: calcium is in the flavoured liquid (0.5% calcium lactate gluconate) and alginate is in the bath. Produces a thicker shell and longer shelf life.',
        ],
      },
      {
        type: 'steps',
        title: 'Agar Gels and Soy Lecithin Foams',
        items: [
          'Agar agar (derived from red algae) sets at room temperature and holds above 175°F — unlike gelatin, which melts at body temperature. Use 0.2–0.5% for a soft gel, 0.8–1.5% for a firm one.',
          'Dissolve agar in cold liquid, bring to a boil while stirring for 1–2 minutes to activate, then pour and allow to set.',
          'Agar gels can be blended into a fluid gel — a gel texture that flows when agitated but holds its shape at rest. Used for sauce presentations with unusual body.',
          'Soy lecithin foam: blend 3–5g soy lecithin powder into 500ml of any liquid. Using an immersion blender angled at the surface, foam the liquid and spoon only the foam. Produces an airy, flavourful cloud that retains shape for 15–30 minutes.',
        ],
      },
      {
        type: 'callout',
        title: 'The Guiding Principle',
        body: 'Molecular techniques are tools, not ends in themselves. Every technique should serve the guest\'s experience — a spherified olive oil burst inside a pasta dish adds surprise and flavour at exactly the right moment. Techniques that confuse rather than delight, or that prioritise novelty over eating pleasure, miss the point entirely. Master the principles of flavour first; these techniques are the most powerful when deployed by a cook who already has that foundation.',
      },
    ],
  },
  {
    id: 'a9',
    readTime: '11 min read',
    sections: [
      {
        type: 'intro',
        body: 'Charcuterie — the French art of preparing and preserving meats — is one of the oldest and most sophisticated culinary traditions. It encompasses curing, smoking, fermenting, and emulsifying, and requires a precise understanding of salt chemistry, pH, water activity, and microbiology. Done correctly, it produces some of the most intensely flavoured foods in any cuisine.',
      },
      {
        type: 'text',
        title: 'The Science of Salt Curing',
        body: 'Salt curing works by reducing water activity (Aw) — the amount of free water available to microbial growth. As salt concentration increases on the surface of meat, it draws water out through osmosis, creating an environment inhospitable to spoilage bacteria. Equilibrium curing uses a precise percentage of salt by total weight of the meat (usually 2.5–3.5% for whole muscle, more for ground meat), ensuring the cure penetrates evenly without over-salting. Nitrates (sodium nitrite, Prague Powder #1 for short cures; sodium nitrate, Prague Powder #2 for long-cured products like salami) prevent Clostridium botulinum growth and produce the characteristic pink colour and cured flavour of bacon, ham, and salumi.',
      },
      {
        type: 'steps',
        title: 'Dry-Cured Pancetta',
        items: [
          'Calculate your cure: per 1 kg pork belly — 25g kosher salt, 2.75g Prague Powder #1, 5g black pepper, 3g sugar, herbs.',
          'Mix cure ingredients thoroughly and rub all over the pork belly, ensuring every surface is covered.',
          'Seal in a zip-lock bag or vacuum bag and refrigerate for 7 days, turning and massaging daily to redistribute the cure.',
          'Rinse the cured belly thoroughly, dry with paper towels, and wrap in cheesecloth.',
          'Hang in a cool, humid environment (50–60°F, 70–80% humidity) for 2–3 weeks until the pancetta feels firm and has lost 30% of its original weight.',
          'Slice thinly and use as-is (for cooking) or eaten raw on charcuterie boards.',
        ],
      },
      {
        type: 'tips',
        title: 'Charcuterie Safety',
        items: [
          'Always use nitrates from a reliable source (Prague Powder) when curing whole muscle products that will be served without heat.',
          'Water activity below 0.85 is generally considered safe for most pathogens; whole muscle cures with equilibrium method reliably achieve this.',
          'Temperature control is critical: cure in the refrigerator, never at room temperature.',
          'Invest in an accurate gram scale — imprecise cure calculations are the most common cause of safety issues in home charcuterie.',
          'Safe to eat resources: Michael Ruhlman\'s "Charcuterie" is the definitive English-language reference for home curers.',
        ],
      },
    ],
  },
  {
    id: 'a10',
    readTime: '10 min read',
    sections: [
      {
        type: 'intro',
        body: 'The difference between a good cook and a great chef is not technique — it\'s mindset. Technique can be learned from books and practice. The chef\'s mindset — the ability to think creatively, to improvise under pressure, to taste and adjust without a recipe, and to develop a genuine culinary point of view — is developed through deliberate attention over time.',
      },
      {
        type: 'text',
        title: 'Cooking Without Recipes',
        body: 'A recipe is a record of one cook\'s decisions at one moment in time. Your ingredients are different, your equipment is different, your palate is different, and the season is different. Great cooks treat recipes as reference points, not instructions. To cook without recipes, you need to understand structure: protein + starch + vegetable + sauce + acid + garnish is a complete dish regardless of what fills each role. Once you can identify the structure of a dish, you can rebuild it with whatever\'s in front of you.',
      },
      {
        type: 'steps',
        title: 'Developing Your Palate',
        items: [
          'Taste everything — and taste comparatively. Taste your dish before and after adding each ingredient. Know what each ingredient contributes.',
          'Eat widely and intentionally. Visit restaurants across different cuisines and focus not on enjoying the meal, but on reverse-engineering what you taste.',
          'Keep a flavour journal: when you eat something exceptional, write down the components, the balance of salt/acid/fat/heat, and the texture contrasts.',
          'Taste your failed dishes and diagnose them honestly. Did it need acid? Was it too salty? Overcooked? Under-seasoned? Each failure is a lesson.',
          'Develop your spice vocabulary: buy 20 spices and taste each one alone — the flavour of cumin, coriander, sumac, and cardamom should be as familiar to you as the flavour of sugar.',
        ],
      },
      {
        type: 'text',
        title: 'Developing a Signature Style',
        body: 'Every great cook has a point of view — a set of flavour preferences, technique choices, and aesthetic sensibilities that make their food identifiably theirs. Signature style develops by cooking the same thing many times with small variations: a vinaigrette you make every week, a sauce you revisit every month, a dish you\'ve made a hundred times and still refine. It develops by knowing your preferences: do you prefer bright, acidic food or rich, umami-forward food? Delicate or bold seasoning? Rustic or refined presentation? Your answers are the beginning of your identity as a cook.',
      },
      {
        type: 'callout',
        title: 'The 10,000 Hours Principle',
        body: 'Malcolm Gladwell\'s 10,000-hour rule — that mastery of any complex skill requires roughly 10,000 hours of deliberate practice — applies directly to cooking. But deliberate practice means cooking with attention: asking why each step works, tasting continuously, identifying what went wrong, and changing one variable at a time. A cook who makes 10,000 meals on autopilot learns less than one who makes 100 with full attention. Cook with curiosity. Every meal is an opportunity to understand something more deeply.',
      },
    ],
  },
];
