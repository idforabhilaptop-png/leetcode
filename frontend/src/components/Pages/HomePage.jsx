
import  { useState } from 'react';
import { leetcodeLogo2 } from '../../assets/images';

/**
 * Hexagon Component for icons
 */
const HexIcon= ({ children, className = "", size = "w-16 h-16", bgColor = "bg-teal-500" }) => (
  <div className={`relative ${size} flex items-center justify-center ${className}`}>
    <div className={`absolute inset-0 ${bgColor} hexagon-clip`}></div>
    <div className="relative z-10 text-white">
      {children}
    </div>
  </div>
);


const CODE_SNIPPETS = {
  'Linked List': {
    'C++': `void deleteNode(ListNode* node) {
    *node = *node->next;
}

void prettyPrint(ListNode* node) {
    while (node) {
        cout << node->val << " -> ";
        node = node->next;
    }
    cout << "NULL" << endl;
}`,
    'Java': `public void deleteNode(ListNode node) {
    node.val = node.next.val;
    node.next = node.next.next;
}

public void printList(ListNode head) {
    while (head != null) {
        System.out.print(head.val + " -> ");
        head = head.next;
    }
    System.out.println("null");
}`,
    'Python': `def deleteNode(node):
    node.val = node.next.val
    node.next = node.next.next

def print_list(head):
    while head:
        print(f"{head.val} -> ", end="")
        head = head.next
    print("None")`
  },
  'Binary Tree': {
    'C++': `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), 
                   maxDepth(root->right));
}

void inorder(TreeNode* root) {
    if (!root) return;
    inorder(root->left);
    cout << root->val << " ";
    inorder(root->right);
}`,
    'Java': `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), 
                        maxDepth(root.right));
}

public void inorder(TreeNode root) {
    if (root == null) return;
    inorder(root.left);
    System.out.print(root.val + " ");
    inorder(root.right);
}`,
    'Python': `def max_depth(root):
    if not root: return 0
    return 1 + max(max_depth(root.left), 
                   max_depth(root.right))

def inorder(root):
    if not root: return
    inorder(root.left)
    print(root.val, end=" ")
    inorder(root.right)`
  },
  'Fibonacci': {
    'C++': `int fib(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}`,
    'Java': `public int fib(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n + 1];
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}`,
    'Python': `def fib(n):
    if n <= 1: return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

# Using recursion with memoization
@cache
def fib_recursive(n):
    if n <= 1: return n
    return fib_recursive(n-1) + fib_recursive(n-2)`
  }
};

const HomePage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('C++');
  const [selectedTopic, setSelectedTopic] = useState('Linked List');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full scroll-smooth">
      {/* --- HERO SECTION --- */}
      <section className="relative bg-[#262626] pb-32 text-white overflow-hidden">
        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
           <img src={leetcodeLogo2} alt="" className='w-10 h-10' />
            <span className="text-2xl font-semibold tracking-tight">LeetCode</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium">
            <button onClick={() => scrollToSection('explore')} className="hover:text-gray-300 transition-colors">Explore</button>
            <button onClick={() => scrollToSection('product')} className="hover:text-gray-300 transition-colors">Product</button>
            <button onClick={() => scrollToSection('developer')} className="hover:text-gray-300 transition-colors">Developer</button>
            <a href="/login" className="hover:text-gray-300 transition-colors">Sign in</a>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-6 mt-20 flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Tablet Graphic */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-80 h-56 bg-white rounded-3xl shadow-2xl p-4 flex flex-col gap-3 transform rotate-[-5deg]">
              <div className="flex gap-2">
                <div className="w-12 h-12 bg-blue-400 rounded-lg"></div>
                <div className="w-12 h-12 bg-orange-400 rounded-lg"></div>
                <div className="w-12 h-12 bg-red-400 rounded-lg"></div>
                <div className="w-12 h-12 bg-green-400 rounded-lg"></div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-2 w-full bg-gray-100 rounded"></div>
                  <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
                  <div className="h-2 w-full bg-gray-100 rounded"></div>
                </div>
                <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center px-2 mt-auto">
                <div className="w-24 h-1 bg-gray-200 rounded"></div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Text */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl font-bold mb-6">A New Way to Learn</h1>
            <p className="text-gray-400 text-lg mb-8 max-w-lg">
              LeetCode is the best platform to help you enhance your skills, expand your knowledge and prepare for technical interviews.
            </p>
            <a href="/signup" className="inline-flex bg-[#00b5ad] hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-full items-center gap-2 transition-all mx-auto md:mx-0">
              Create Account 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* --- START EXPLORING SECTION --- */}
      <section id="explore" className="relative bg-white pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-16">
          <div className="order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl font-semibold text-teal-600">Start Exploring</h2>
              <HexIcon bgColor="bg-teal-600">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
                </svg>
              </HexIcon>
            </div>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed max-w-md">
              Explore is a well-organized tool that helps you get the most out of LeetCode by providing structure to guide your progress towards the next step in your programming career.
            </p>
            <a href="/signup" className="text-blue-500 font-medium flex items-center gap-1 hover:underline">
              Get Started
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Floating Cards */}
          <div className="order-1 md:order-2 flex justify-center relative">
            <div className="relative w-full max-w-sm h-64">
              <div className="absolute top-0 right-32 w-48 h-64 bg-yellow-50 rounded-2xl shadow-lg border border-yellow-100 transform -rotate-6 z-10"></div>
              <div className="absolute top-0 right-16 w-48 h-64 bg-green-50 rounded-2xl shadow-lg border border-green-100 transform -rotate-3 z-20"></div>
              <div className="absolute top-0 right-0 w-48 h-64 bg-teal-400 rounded-2xl shadow-xl p-4 text-white z-30 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-12 h-2 bg-white/40 rounded"></div>
                  <div className="w-16 h-4 bg-white/60 rounded"></div>
                </div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-teal-500 border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
                <div className="w-full h-8 bg-white/20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- COMMUNITY & COMPANIES (PRODUCT) SECTION --- */}
      <section id="product" className="bg-white py-24 border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          {/* Questions, Community & Contests */}
          <div>
            <div className="flex gap-4 mb-8">
              <HexIcon bgColor="bg-blue-400" size="w-12 h-12">
                <span className="text-xs font-bold">4050</span>
              </HexIcon>
              <HexIcon bgColor="bg-green-500" size="w-12 h-12">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </HexIcon>
              <HexIcon bgColor="bg-yellow-500" size="w-12 h-12">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2H6v2H4v7c0 3.31 2.69 6 6 6v2H8v2h8v-2h-2v-2c3.31 0 6-2.69 6-6V4h-2V2zm0 9c0 2.21-1.79 4-4 4v-2c0-2.21 1.79-4 4-4V4h2v7zm-12 4c-2.21 0-4-1.79-4-4V4h2v7c0 2.21 1.79 4 4 4v2z" />
                </svg>
              </HexIcon>
            </div>
            <h3 className="text-2xl font-semibold text-blue-500 mb-6">Questions, Community & Contests</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Over 4050 questions for you to practice. Come and join one of the largest tech communities with hundreds of thousands of active users and participate in our contests to challenge yourself and earn rewards.
            </p>
          </div>

          {/* Companies & Candidates */}
          <div>
            <div className="flex gap-4 mb-8">
              <HexIcon bgColor="bg-yellow-600" size="w-12 h-12">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                </svg>
              </HexIcon>
              <HexIcon bgColor="bg-gray-400" size="w-12 h-12">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8V9h2V7h2v2h2v2h2v8zm-2-6h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                </svg>
              </HexIcon>
            </div>
            <h3 className="text-2xl font-semibold text-yellow-600 mb-6">Companies & Candidates</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Not only does LeetCode prepare candidates for technical interviews, we also help companies identify top technical talent. From sponsoring contests to providing online assessments and training, we offer numerous services to businesses.
            </p>
          </div>
        </div>
      </section>

      {/* --- DEVELOPER SECTION --- */}
      <section id="developer" className="bg-[#f7f9fa] py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <HexIcon bgColor="bg-teal-600" className="mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </HexIcon>
            <h2 className="text-4xl font-semibold text-teal-600 mb-6">Developer</h2>
            <p className="text-gray-500 text-lg leading-relaxed max-w-3xl">
              We now support 14 popular coding languages. At our core, LeetCode is about developers. Our powerful development tools such as Playground help you test, debug and even write your own projects online.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_280px] gap-8">
            {/* Code Editor Container */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
              <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
                <div className="flex gap-1">
                   {(['C++', 'Java', 'Python'] ).map(lang => (
                     <button 
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-6 py-2 text-sm font-medium transition-all ${selectedLanguage === lang ? 'bg-white text-gray-800 border-t-2 border-teal-500' : 'text-gray-400 hover:text-gray-600'}`}>
                        {lang}
                     </button>
                   ))}
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-green-500 rounded shadow-sm hover:bg-green-600">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    Run
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-neutral-800 rounded shadow-sm hover:bg-neutral-900">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm1 9h-2V7h2v8z"/></svg>
                    Playground
                  </button>
                </div>
              </div>
              <div className="p-4 bg-gray-50 font-mono text-sm leading-6 flex overflow-x-auto min-h-87.5">
                <div className="text-gray-400 pr-4 text-right select-none border-r border-gray-200 mr-4">
                  {Array.from({length: 15}).map((_, i) => <div key={i}>{i + 1}</div>)}
                </div>
                <pre className="text-gray-800 flex-1">
                  <code>{CODE_SNIPPETS[selectedTopic][selectedLanguage]}</code>
                </pre>
              </div>
            </div>

            {/* Editor Sidebar */}
            <div className="space-y-4">
               {(['Linked List', 'Binary Tree', 'Fibonacci'] ).map(topic => (
                  <button 
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full text-left p-4 rounded-lg shadow-md border transition-all flex items-center gap-2 font-medium ${selectedTopic === topic ? 'bg-white border-teal-100 text-teal-600 shadow-teal-50/50' : 'bg-transparent border-transparent text-blue-500 hover:bg-white hover:shadow-sm'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {topic}
                  </button>
               ))}
               <div className="pt-4 border-t border-gray-100 mt-4">
                 <a href="/signup" className="text-blue-500 font-medium flex items-center gap-1 hover:underline">
                   Create Playground
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                 </a>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MADE WITH LOVE SECTION --- */}
      <section className="bg-white py-32 border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-8">
            <HexIcon bgColor="bg-red-500">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 11-5.656 5.656l-1.102-1.101" />
               </svg>
            </HexIcon>
          </div>
          <h2 className="text-3xl font-bold text-red-500 mb-8">Made with <span className="text-red-500">❤</span> in SF</h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto mb-20">
            At LeetCode, our mission is to help you improve yourself and land your dream job. We have a sizable repository of interview resources for many companies. In the past few years, our users have landed jobs at top companies around the world.
          </p>

          <div className="border-t border-gray-100 pt-16">
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              If you are passionate about tackling some of the most interesting problems around, we would love to hear from you.
            </p>
            <a href="/signup" className="text-blue-500 font-medium flex items-center justify-center gap-1 hover:underline">
              Join Our Team
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>Copyright © 2025 LeetCode</div>
          <div className="flex gap-6">
            <a href="/signup" className="hover:text-gray-800 transition-colors">Register</a>
            <a href="/login" className="hover:text-gray-800 transition-colors">Sign in</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;