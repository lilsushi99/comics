<?php

namespace App\Http/Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Setting;
use App\Models\HomepageLayout;
use App\Models\PortfolioProject;
use App\Models\BlogArticle;
use App\Models\Testimonial;
use App\Models\SocialLink;
use App\Models\MediaAsset;

class CMSController extends Controller
{
    /**
     * Authenticate Administrator using Laravel standard Sanctum credentials
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'The provided administrator credentials do not match our database records.'
            ], 401);
        }

        // Return standard Sanctum Bearer Token
        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
            'message' => 'Authenticated successfully.'
        ]);
    }

    /**
     * Fetch complete unified CMS schema from MySQL database tables
     */
    public function getCMSData()
    {
        // 1. Core configs stored in Settings table
        $hero = Setting::getValue('hero', [
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

        $services = Setting::getValue('services', [
            'enabled' => true,
            'speed' => 15,
            'marqueeWords' => [
                'SEQUENTIAL STORYBOARDING', 'TRADITIONAL COMIC INKING', 'CHARACTER DESIGN',
                'MANGA BLUEPRINTING', 'MANHWA STYLING', 'IP DEVELOPMENT'
            ]
        ]);

        $studio = Setting::getValue('studio', [
            'badge' => 'THE KAIJU STUDIOS MANIFESTO',
            'title' => 'OUR CORE VALUES',
            'philosophy' => "We believe that ink has power. Comic books, storyboards, and illustration layouts are not mere drawings—they are structured visual engines carrying raw emotion, action, and human expression.",
            'manifestoPoints' => [
                ['id' => 'mp-1', 'title' => 'Structural Integrity First', 'text' => 'Every dynamic page must respect sequential frame perspective, lighting contrast, and pacing before fine panel details are rendered.'],
                ['id' => 'mp-2', 'title' => 'Traditional Artistry', 'text' => 'We preserve classic dry ink brushwork, high-density feathering, and custom screen-toning alongside high-resolution digital layers.'],
                ['id' => 'mp-3', 'title' => 'Narrative Action Pacing', 'text' => 'We study character velocity curves and eye tracking paths to guide visual speed seamlessly across panels.']
            ]
        ]);

        $navigation = Setting::getValue('navigation', [
            'title' => 'KAIJU',
            'links' => [
                ['id' => 'nav-home', 'text' => 'Home', 'page' => 'home'],
                ['id' => 'nav-portfolio', 'text' => 'Portfolio', 'page' => 'portfolio'],
                ['id' => 'nav-blog', 'text' => 'Blog', 'page' => 'blog'],
                ['id' => 'nav-manifesto', 'text' => 'Manifesto', 'page' => 'manifesto']
            ]
        ]);

        $showcase = Setting::getValue('showcase', [
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

        $contact = Setting::getValue('contact', [
            'title' => 'LAUNCH AN INQUIRY',
            'subtitle' => 'Have a creative storyboard layout or sequential illustration project? Connect with our team to initiate a secure design transaction.',
            'fields' => [
                ['id' => 'f-name', 'label' => 'ORGANIZATION NAME', 'type' => 'text', 'placeholder' => 'e.g. Shogun Comics LLC', 'required' => true],
                ['id' => 'f-email', 'label' => 'CONTACT EMAIL', 'type' => 'email', 'placeholder' => 'e.g. editor@shogun.com', 'required' => true],
                ['id' => 'f-type', 'label' => 'PROJECT SPECIFICATION', 'type' => 'select', 'placeholder' => 'Select a discipline...', 'required' => true, 'options' => ['Dynamic Storyboards', 'Sequential Comic Panels', 'Concept Art Sheets', 'Other Illustrative Work']],
                ['id' => 'f-msg', 'label' => 'CREATIVE BRIEF DESCRIPTION', 'type' => 'textarea', 'placeholder' => 'Provide lore references, reference pacing, and frame constraints...', 'required' => true]
            ]
        ]);

        // 2. Structural DB Models
        $homepageLayout = HomepageLayout::orderBy('order', 'asc')->get()->map(function($sec) {
            return [
                'id' => $sec->section_id,
                'name' => $sec->name,
                'enabled' => $sec->enabled
            ];
        })->toArray();

        // Fallback for default layouts if table empty
        if (empty($homepageLayout)) {
            $homepageLayout = [
                ['id' => 'services', 'name' => 'Moving Keywords', 'enabled' => true],
                ['id' => 'showcase', 'name' => 'Visual Showcase Conveyors', 'enabled' => true],
                ['id' => 'portfolio', 'name' => 'Portfolio Grid', 'enabled' => true],
                ['id' => 'blog', 'name' => 'Recent Articles Blog', 'enabled' => true],
                ['id' => 'studio', 'name' => 'Studio Manifesto Card', 'enabled' => true],
                ['id' => 'testimonials', 'name' => 'Testimonial grid', 'enabled' => true],
                ['id' => 'contact', 'name' => 'Secure Inquiry Form', 'enabled' => true],
            ];
        }

        $projects = PortfolioProject::orderBy('id', 'desc')->get()->map(function($proj) {
            return [
                'id' => (string)$proj->id,
                'slug' => $proj->slug,
                'title' => $proj->title,
                'category' => $proj->category,
                'tag' => $proj->tag,
                'image' => $proj->image,
                'description' => $proj->description,
                'longDescription' => $proj->long_description,
                'client' => $proj->client,
                'year' => $proj->year,
                'tags' => $proj->tags ?? [],
                'galleryImages' => $proj->gallery_images ?? [],
                'tools' => $proj->tools ?? [],
                'visualDetails' => $proj->visual_details ?? [],
            ];
        })->toArray();

        $portfolio = [
            'categories' => array_values(array_unique(array_column($projects, 'category'))),
            'projects' => $projects
        ];

        $articles = BlogArticle::orderBy('id', 'desc')->get()->map(function($art) {
            return [
                'id' => (string)$art->id,
                'slug' => $art->slug,
                'title' => $art->title,
                'category' => $art->category,
                'readTime' => $art->read_time,
                'publishDate' => $art->publish_date,
                'author' => $art->author,
                'summary' => $art->summary,
                'image' => $art->image,
                'content' => $art->content,
                'tags' => $art->tags ?? [],
            ];
        })->toArray();

        $blog = [
            'categories' => array_values(array_unique(array_column($articles, 'category'))),
            'articles' => $articles
        ];

        $testimonials = Testimonial::all()->map(function($test) {
            return [
                'id' => (string)$test->id,
                'author' => $test->author,
                'role' => $test->role,
                'company' => $test->company,
                'avatar' => $test->avatar,
                'content' => $test->content,
                'rating' => $test->rating,
                'tags' => $test->tags ?? [],
            ];
        })->toArray();

        $socials = SocialLink::all()->map(function($link) {
            return [
                'name' => $link->name,
                'url' => $link->url,
                'enabled' => $link->enabled
            ];
        })->toArray();

        $mediaLibrary = MediaAsset::orderBy('id', 'desc')->get()->map(function($asset) {
            return [
                'id' => (string)$asset->id,
                'name' => $asset->name,
                'type' => $asset->type,
                'url' => $asset->url,
                'uploadedAt' => $asset->created_at->format('Y-m-d')
            ];
        })->toArray();

        return response()->json([
            'hero' => $hero,
            'services' => $services,
            'portfolio' => $portfolio,
            'blog' => $blog,
            'studio' => $studio,
            'testimonials' => $testimonials,
            'navigation' => $navigation,
            'contact' => $contact,
            'showcase' => $showcase,
            'homepageLayout' => $homepageLayout,
            'socials' => $socials,
            'mediaLibrary' => $mediaLibrary,
        ]);
    }

    /**
     * Save/Synchronize complex unified CMS state into separate relational database nodes
     */
    public function saveCMSData(Request $request)
    {
        $data = $request->json()->all();

        // 1. Settings values (JSON block cast updates)
        if (isset($data['hero'])) Setting::setValue('hero', $data['hero']);
        if (isset($data['services'])) Setting::setValue('services', $data['services']);
        if (isset($data['studio'])) Setting::setValue('studio', $data['studio']);
        if (isset($data['navigation'])) Setting::setValue('navigation', $data['navigation']);
        if (isset($data['contact'])) Setting::setValue('contact', $data['contact']);
        if (isset($data['showcase'])) Setting::setValue('showcase', $data['showcase']);

        // 2. Layout maps
        if (isset($data['homepageLayout'])) {
            foreach ($data['homepageLayout'] as $idx => $sec) {
                HomepageLayout::updateOrCreate(
                    ['section_id' => $sec['id']],
                    [
                        'name' => $sec['name'],
                        'enabled' => $sec['enabled'],
                        'order' => $idx
                    ]
                );
            }
        }

        // 3. Social connections
        if (isset($data['socials'])) {
            foreach ($data['socials'] as $social) {
                SocialLink::updateOrCreate(
                    ['name' => $social['name']],
                    [
                        'url' => $social['url'],
                        'enabled' => $social['enabled'] ?? true
                    ]
                );
            }
        }

        // 4. Portfolio Projects mapper
        if (isset($data['portfolio']['projects'])) {
            $incomingIds = [];
            foreach ($data['portfolio']['projects'] as $proj) {
                $dbProj = PortfolioProject::updateOrCreate(
                    ['slug' => $proj['slug']],
                    [
                        'title' => $proj['title'],
                        'category' => $proj['category'],
                        'tag' => $proj['tag'],
                        'image' => $proj['image'] ?? '',
                        'description' => $proj['description'] ?? '',
                        'long_description' => $proj['longDescription'] ?? '',
                        'client' => $proj['client'] ?? '',
                        'year' => $proj['year'] ?? '',
                        'tags' => $proj['tags'] ?? [],
                        'gallery_images' => $proj['galleryImages'] ?? [],
                        'tools' => $proj['tools'] ?? [],
                        'visual_details' => $proj['visualDetails'] ?? [],
                    ]
                );
                $incomingIds[] = $dbProj->id;
            }
            // Delete deleted projects
            PortfolioProject::whereNotIn('id', $incomingIds)->delete();
        }

        // 5. Blog Articles mapper
        if (isset($data['blog']['articles'])) {
            $incomingIds = [];
            foreach ($data['blog']['articles'] as $art) {
                $dbArt = BlogArticle::updateOrCreate(
                    ['slug' => $art['slug']],
                    [
                        'title' => $art['title'],
                        'category' => $art['category'],
                        'read_time' => $art['readTime'] ?? '',
                        'publish_date' => $art['publishDate'] ?? '',
                        'author' => $art['author'] ?? '',
                        'summary' => $art['summary'] ?? '',
                        'image' => $art['image'] ?? '',
                        'content' => $art['content'] ?? '',
                        'tags' => $art['tags'] ?? [],
                    ]
                );
                $incomingIds[] = $dbArt->id;
            }
            BlogArticle::whereNotIn('id', $incomingIds)->delete();
        }

        // 6. Testimonials mapper
        if (isset($data['testimonials'])) {
            $incomingIds = [];
            foreach ($data['testimonials'] as $test) {
                $dbTest = Testimonial::updateOrCreate(
                    ['author' => $test['author'], 'company' => $test['company'] ?? ''],
                    [
                        'role' => $test['role'] ?? '',
                        'avatar' => $test['avatar'] ?? '',
                        'content' => $test['content'] ?? '',
                        'rating' => $test['rating'] ?? 5,
                        'tags' => $test['tags'] ?? [],
                    ]
                );
                $incomingIds[] = $dbTest->id;
            }
            Testimonial::whereNotIn('id', $incomingIds)->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'CMS state successfully synchronized to MySQL tables!'
        ]);
    }

    /**
     * File upload handler utilizing Laravel public storage disk
     */
    public function uploadMedia(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:51200' // max 50MB
        ]);

        $file = $request->file('file');
        
        // Save using Laravel Storage to public public disk (which symlinks /storage to /public/storage)
        $path = $file->store('media', 'public');
        $url = Storage::url($path);

        $type = 'image';
        $mime = $file->getMimeType();
        if (str_contains($mime, 'video')) {
            $type = 'video';
        } elseif (str_contains($mime, 'audio')) {
            $type = 'audio';
        }

        $asset = MediaAsset::create([
            'name' => $file->getClientOriginalName(),
            'type' => $type,
            'url' => $url,
            'file_path' => $path,
            'size' => number_format($file->getSize() / 1024, 2) . ' KB'
        ]);

        return response()->json([
            'success' => true,
            'url' => $url,
            'asset' => [
                'id' => (string)$asset->id,
                'name' => $asset->name,
                'type' => $asset->type,
                'url' => $asset->url,
                'uploadedAt' => $asset->created_at->format('Y-m-d')
            ]
        ]);
    }

    /**
     * Resolve and download external assets to Laravel local disk
     */
    public function downloadExternalUrl(Request $request)
    {
        $request->validate([
            'url' => 'required|url'
        ]);

        $url = $request->input('url');
        $fileName = 'ext_' . time() . '_' . basename(parse_url($url, PHP_URL_PATH) ?: 'image.jpg');

        try {
            $content = file_get_contents($url);
            if ($content === false) {
                throw new \Exception('Failed to download source asset.');
            }

            $filePath = 'media/' . $fileName;
            Storage::disk('public')->put($filePath, $content);
            $localUrl = Storage::url($filePath);

            $asset = MediaAsset::create([
                'name' => $fileName,
                'type' => 'image',
                'url' => $localUrl,
                'file_path' => $filePath,
                'size' => number_format(strlen($content) / 1024, 2) . ' KB'
            ]);

            return response()->json([
                'success' => true,
                'url' => $localUrl
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error resolution: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Clear and reset relational models back to system default seeds
     */
    public function resetCMSData()
    {
        // Run database migrations/seeding or mock restoring default values
        Setting::truncate();
        HomepageLayout::truncate();
        PortfolioProject::truncate();
        BlogArticle::truncate();
        Testimonial::truncate();
        SocialLink::truncate();
        MediaAsset::truncate();

        // Database seeding triggers
        $seeder = new \Database\Seeders\DatabaseSeeder();
        $seeder->run();

        return $this->getCMSData();
    }
}
