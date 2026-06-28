<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Setting;
use App\Models\HomepageLayout;
use App\Models\PortfolioProject;
use App\Models\BlogArticle;
use App\Models\Testimonial;
use App\Models\SocialLink;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Default Admin User
        User::create([
            'name' => 'Keiji Sato',
            'email' => 'admin@kaijustudios.com',
            'password' => Hash::make('admin-kaiju'),
        ]);

        // 2. Initial Settings values
        Setting::setValue('hero', [
            'badge' => 'CREATIVE COMIC & SEQUENTIAL STUDIO',
            'title' => 'CRAFTING COMICS WITH IMPACT',
            'subtitle' => 'We are an indie creative agency specializing in sequential art, bespoke character concept boards, storyboards, and manga illustrations.',
            'backgroundImage' => 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=2070',
            'starfield' => [
                'numStars' => 50,
                'speed' => 1.5,
                'brightness' => 1.0,
                'enableHover' => true,
            ],
            'buttons' => [
                ['id' => 'btn-portfolio', 'text' => 'Launch Portfolio', 'url' => 'portfolio', 'style' => 'primary', 'type' => 'internal', 'openNewTab' => false, 'icon' => 'Sparkles', 'visible' => true],
                ['id' => 'btn-manifesto', 'text' => 'Read Manifesto', 'url' => 'manifesto', 'style' => 'secondary', 'type' => 'internal', 'openNewTab' => false, 'icon' => 'FileText', 'visible' => true]
            ]
        ]);

        Setting::setValue('services', [
            'enabled' => true,
            'speed' => 15,
            'marqueeWords' => [
                'SEQUENTIAL STORYBOARDING', 'TRADITIONAL COMIC INKING', 'CHARACTER DESIGN',
                'MANGA BLUEPRINTING', 'MANHWA STYLING', 'IP DEVELOPMENT'
            ]
        ]);

        Setting::setValue('studio', [
            'badge' => 'THE KAIJU STUDIOS MANIFESTO',
            'title' => 'OUR CORE VALUES',
            'philosophy' => "We believe that ink has power. Comic books, storyboards, and illustration layouts are not mere drawings—they are structured visual engines carrying raw emotion, action, and human expression.",
            'manifestoPoints' => [
                ['id' => 'mp-1', 'title' => 'Structural Integrity First', 'text' => 'Every dynamic page must respect sequential frame perspective, lighting contrast, and pacing before fine panel details are rendered.'],
                ['id' => 'mp-2', 'title' => 'Traditional Artistry', 'text' => 'We preserve classic dry ink brushwork, high-density feathering, and custom screen-toning alongside high-resolution digital layers.'],
                ['id' => 'mp-3', 'title' => 'Narrative Action Pacing', 'text' => 'We study character velocity curves and eye tracking paths to guide visual speed seamlessly across panels.']
            ]
        ]);

        Setting::setValue('navigation', [
            'title' => 'KAIJU',
            'links' => [
                ['id' => 'nav-home', 'text' => 'Home', 'page' => 'home'],
                ['id' => 'nav-portfolio', 'text' => 'Portfolio', 'page' => 'portfolio'],
                ['id' => 'nav-blog', 'text' => 'Blog', 'page' => 'blog'],
                ['id' => 'nav-manifesto', 'text' => 'Manifesto', 'page' => 'manifesto']
            ]
        ]);

        Setting::setValue('showcase', [
            'panel1' => [
                'enabled' => true,
                'speed' => 3,
                'media' => [
                    ['id' => 'p1-m1', 'url' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', 'type' => 'image'],
                    ['id' => 'p1-m2', 'url' => 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800', 'type' => 'image']
                ]
            ],
            'panel2' => [
                'enabled' => true,
                'speed' => 4,
                'media' => [
                    ['id' => 'p2-m1', 'url' => 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800', 'type' => 'image'],
                    ['id' => 'p2-m2', 'url' => 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800', 'type' => 'image']
                ]
            ],
            'panel3' => [
                'enabled' => true,
                'speed' => 3.5,
                'media' => [
                    ['id' => 'p3-m1', 'url' => 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800', 'type' => 'image'],
                    ['id' => 'p3-m2', 'url' => 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800', 'type' => 'image']
                ]
            ]
        ]);

        Setting::setValue('contact', [
            'title' => 'LAUNCH AN INQUIRY',
            'subtitle' => 'Have a creative storyboard layout or sequential illustration project? Connect with our team to initiate a secure design transaction.',
            'fields' => [
                ['id' => 'f-name', 'label' => 'ORGANIZATION NAME', 'type' => 'text', 'placeholder' => 'e.g. Shogun Comics LLC', 'required' => true],
                ['id' => 'f-email', 'label' => 'CONTACT EMAIL', 'type' => 'email', 'placeholder' => 'e.g. editor@shogun.com', 'required' => true],
                ['id' => 'f-type', 'label' => 'PROJECT SPECIFICATION', 'type' => 'select', 'placeholder' => 'Select a discipline...', 'required' => true, 'options' => ['Dynamic Storyboards', 'Sequential Comic Panels', 'Concept Art Sheets', 'Other Illustrative Work']],
                ['id' => 'f-msg', 'label' => 'CREATIVE BRIEF DESCRIPTION', 'type' => 'textarea', 'placeholder' => 'Provide lore references, reference pacing, and frame constraints...', 'required' => true]
            ]
        ]);

        // 3. Homepage layout order
        $layouts = [
            ['services', 'Moving Keywords'],
            ['showcase', 'Visual Showcase Conveyors'],
            ['portfolio', 'Portfolio Grid'],
            ['blog', 'Recent Articles Blog'],
            ['studio', 'Studio Manifesto Card'],
            ['testimonials', 'Testimonial grid'],
            ['contact', 'Secure Inquiry Form'],
        ];
        foreach ($layouts as $idx => $lay) {
            HomepageLayout::create([
                'section_id' => $lay[0],
                'name' => $lay[1],
                'enabled' => true,
                'order' => $idx
            ]);
        }

        // 4. Social Links Seeding
        $socials = [
            ['Instagram', 'https://instagram.com/kaijustudios'],
            ['Twitter / X', 'https://x.com/kaijustudios'],
            ['LinkedIn', 'https://linkedin.com/company/kaijustudios'],
            ['Behance', 'https://behance.net/kaijustudios'],
        ];
        foreach ($socials as $soc) {
            SocialLink::create([
                'name' => $soc[0],
                'url' => $soc[1],
                'enabled' => true
            ]);
        }

        // 5. Portfolio Projects Seeding
        PortfolioProject::create([
            'slug' => 'shogun-samurai-ink',
            'title' => 'SHOGUN SAMURAI INK REEL',
            'category' => 'Sequential Panels',
            'tag' => 'Traditional Brush Ink',
            'image' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
            'description' => 'A rigorous, 6-page sequential combat segment showcasing feudal combat framing, rapid perspective changes, and traditional cross-hatching textures.',
            'long_description' => "Designed for Tokyo Manga Bunko publication, this sequential panel series follows a nameless Ronin defending an outpost during a moonlit ambush. The focus was on high-contrast black fields (Beta inks) and dynamic camera lines mimicking cinema focal lengths.\n\nAll panels were drafted physically on Kent 135kg paper using Zebra G-pens and completed with digital screentones for depth.",
            'client' => 'Tokyo Manga Bunko',
            'year' => '2026',
            'tags' => ['Action Sequences', 'Feudal Japan', 'High Pacing'],
            'tools' => ['Traditional G-Pen', 'Pilot Document Ink', 'Clip Studio Paint'],
            'gallery_images' => [
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800'
            ],
            'visual_details' => [
                'Frame structure: 5-7 dynamic panels per page utilizing sliding gutters.',
                'Contrast emphasis: 70% deep ink density with negative space highlights.',
                'Line weights: Thick dynamic impact boundaries paired with ultra-fine feathering lines.'
            ]
        ]);

        PortfolioProject::create([
            'slug' => 'neo-cyber-hacker',
            'title' => 'NEO CYBER ACTION SHEET',
            'category' => 'Concept Boarding',
            'tag' => 'Neon Cyberpunk',
            'image' => 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800',
            'description' => 'Multi-view turnarounds and interactive equipment detail panels for a cyberpunk hacker protagonist, including futuristic weapon systems and interface maps.',
            'long_description' => "Developed as a pre-production concept package for Nova Interactive's upcoming tactical adventure, this character model turnaround sheet establishes character silhouette, weapon arrays, and key emotional expressions.\n\nThe aesthetic combines rigid industrial equipment plates with flowing organic cloth, optimized for 3D modeler reference pipelines.",
            'client' => 'Nova Interactive Games',
            'year' => '2025',
            'tags' => ['Sci-Fi Turnarounds', 'Weapon Design', 'Mech Elements'],
            'tools' => ['Wacom Cintiq Pro 24', 'Adobe Photoshop CC'],
            'gallery_images' => [
                'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800'
            ],
            'visual_details' => [
                'Views included: Front, Side, 3/4 Back, and highly detailed headshot expressions.',
                'Grid markers: Built-in anatomical proportions grids for 3D rigging guides.',
                'Palette swatches: Interactive hexadecimal color references layered onto the artwork.'
            ]
        ]);

        // 6. Blog Articles Seeding
        BlogArticle::create([
            'slug' => 'sequential-panel-composition',
            'title' => 'MASTERING SEQUENTIAL COMIC GUTTERS',
            'category' => 'Studio Work',
            'read_time' => '5 min read',
            'publish_date' => '24 June 2026',
            'author' => 'Keiji Sato',
            'summary' => 'An exploration of how gutter width, diagonal borders, and full-bleed panel layouts dictate reader processing speeds and dramatic tension.',
            'image' => 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800',
            'content' => "The empty space between panels is not merely dead space—it represents time, transitions, and cognitive closure. In comics theory, the gutter acts as a visual bridge where the reader's imagination forms the sequence of events.\n\n### The Golden Rule of Gutter Width\nWhen keeping gutters uniform, you establish a steady, calm narrative flow. However, widening gutters immediately extends the passage of time or introduces quiet pauses, perfect for slow landscape panels or heavy silent realizations.\n\n### Diagonal Borders and Speed\nTo express rapid action, tilt the borders! Diagonal panels break the grid rhythm, creating a subconscious feeling of instablity and velocity. In action storyboarding, diagonal panel overlaps make characters feel like they are bursting out of page bounds.",
            'tags' => ['Comics Theory', 'Storyboard Tutorial', 'Visual Framing']
        ]);

        // 7. Testimonials Seeding
        Testimonial::create([
            'author' => 'Masashi Tanaka',
            'role' => 'Lead Editorial Director',
            'company' => 'Tokyo Manga Bunko',
            'avatar' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
            'content' => "Kaiju Studios delivers storyboards and comic inks of extraordinary technical precision. Their attention to layout, dramatic framing, and feathering line weights completely transformed our core combat segments.",
            'rating' => 5,
            'tags' => ['Sequential Art', 'Manga Editing']
        ]);
    }
}
