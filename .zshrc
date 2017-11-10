source /apollo/env/envImprovement/var/zshrc

export BRAZIL_WORKSPACE_DEFAULT_LAYOUT=short
export PATH=/usr/bin:${PATH}

for f in SDETools envImprovement AmazonAwsCli OdinTools; do
    if [[ -d /apollo/env/$f ]]; then
        export PATH=$PATH:/apollo/env/$f/bin
    fi
done

export AUTO_TITLE_SCREENS="NO"

export PROMPT="
%{$fg[white]%}(%D %*) <%?> [%~] $program %{$fg[default]%}
%{$fg[cyan]%}%m %#%{$fg[default]%} "

export RPROMPT=

set-title() {
    echo -e "\e]0;$*\007"
}

ssh() {
    set-title $*;
    /usr/bin/ssh -2 $*;
    set-title $HOST;
}

alias e=emacs
alias bb=brazil-build

alias bba='brazil-build apollo-pkg'
alias bbr='brazil-build release'
alias bbc='brazil-build clean'
alias bre='brazil-runtime-exec'
alias brc='brazil-recursive-cmd'
alias bws='brazil ws'
alias bwsuse='bws use --gitMode -p'
alias bwscreate='bws create -n'
alias brc=brazil-recursive-cmd
alias bbr='brc brazil-build'
alias bball='brc --allPackages'
alias bbb='brc --allPackages brazil-build'
alias bbra='bbr apollo-pkg'
alias bb32="BRAZIL_PLATFORM_OVERRIDE=RHEL5 brazil-build"
alias bba32="BRAZIL_PLATFORM_OVERRIDE=RHEL5 bba"
alias bbc32="BRAZIL_PLATFORM_OVERRIDE=RHEL5 bbc"

alias kinit="kinit -f"

alias useAlpha64="brazil ws --use -vs CSCentral/WebsiteAlpha-RHEL5_64; brazil ws --sync -md"
alias useBetaGamma="brazil ws --use -vs CSCentral/WebsiteBetaGamma; md"
alias useLiveMerge="brazil ws --use -vs CSCentral/WebsiteBetaGamma-LiveMerge; md"
alias useLive="brazil ws --use -vs live; brazil ws --sync -md"
alias md="brazil ws --sync -md"
alias ssh-devo="ssh -F /dev/null"

alias tmux="tmux attach -t 0"

alias mwinit="mwinit -o"

alias g2s2sbx="/apollo/env/G2S2CommandTools/bin/g2s2 -u https://g2s2-author.integ.amazon.com"
alias g2s2="/apollo/env/G2S2CommandTools/bin/g2s2 -u https://g2s2-author.amazon.com"

alias register_with_aaa='/apollo/env/AAAWorkspaceSupport/bin/register_with_aaa.py'
alias port="sudo /sbin/fuser -n tcp"
