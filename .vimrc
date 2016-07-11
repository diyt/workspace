"" Make vim less annoying
set nocompatible
filetype plugin indent on
set autoread
set lazyredraw
set noerrorbells
set timeout timeoutlen=1000 ttimeoutlen=100

"" Adding some color to vim
:syntax enable
set background=dark
set t_Co=256
set showmatch
set synmaxcol=120

"" Backups and tmp files
silent !mkdir -p ~/.vim/{backup,tmp}
set backup
set backupdir=~/.vim/backup
set directory=~/.vim/tmp

"" Highlight trailing whitespace
highlight ExtraWhitespace ctermbg=red guibg=red
au ColorScheme * highlight ExtraWhitespace guibg=red
au BufEnter * match ExtraWhitespace /\s\+$/
au InsertEnter * match ExtraWhitespace /\s\+\%#\@<!$/
au InsertLeave * match ExtraWhiteSpace /\s\+$/

"" Configure title and status bar
set laststatus=2
set report=0
set showcmd

"" Enable line numbers
set number
set numberwidth=5

"" Scrolling behavior
set scrolloff=10
set sidescrolloff=10

"" Better tab completion
set wildmenu
set wildmode=list:longest
set ofu=syntaxcomplete#Complete
set completeopt+=longest

"" Supertab settings
let g:SuperTabDefaultCompletionType = "context"
let g:SuperTabLongestEnhanced = 1
let g:SuperTabLongestHighlight = 1

"" Better search behavior
set incsearch
set ignorecase
set smartcase
set hlsearch

"" Enable rainbow braces
"au VimEnter * RainbowParenthesesToggle
"au Syntax * RainbowParenthesesLoadRound
"au Syntax * RainbowParenthesesLoadSquare
"au Syntax * RainbowParenthesesLoadBraces

if &term =~ '^screen'
	" tmux will send xterm-style keys when its xterm-keys option is on
	execute "set <xUp>=\e[1;*A"
	execute "set <xDown>=\e[1;*B"
	execute "set <xRight>=\e[1;*C"
	execute " set <xLeft>=\e[1;*D"
endif
