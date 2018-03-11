# Contributing to FreeMAN

Contributions are welcome and necessary. Thanks for taking the time to do so!

The following is taken and adapted with respect from [Atom's Contributing Guidelines](https://github.com/atom/atom/blob/master/CONTRIBUTING.md).

## How to contribute

### Reporting Bugs

This section guides you through submitting a bug report for FreeMAN.
Following these guidelines helps us understand your issue and reproduce the
behavior.

Before creating bug reports, please check this list as you might find out
that you don't need to create one. When you are creating a bug report,
please include as many details as possible. Fill out the required template,
the information it asks for helps us resolve issues faster.

> **Note**: If you find a **Closed** issue that seems like it is the same
thing that you're experiencing, open a new issue and include a link to the
original issue in the body of your new one.

### Submitting A Good Bug Report

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/).
Create an issue on that repository and provide the following information by
filling in [the template](ISSUE_TEMPLATE.md).

Explain the problem and include additional details to help maintainers
reproduce the problem:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details
    as possible. This is not to inconvenience your life, but to make it:

    1. Much easier to identify the issue in the first place and
    2. Verifiable that the issue has been fixed once work on it has been done

* **Provide specific examples to demonstrate the steps**. Include links to
    files or GitHub projects, or copy/pasteable snippets, which you use in
    those examples. If you're providing snippets in the issue, use [Markdown
    code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the behavior you observed after following the steps** and point
    out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the
    described steps and clearly demonstrate the problem. You can use
    [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and
    Windows, and [this tool](https://github.com/colinkeenan/silentcast) or
    [this tool](https://github.com/GNOME/byzanz) on Linux.
* **Include logs**, which are created using [electron-log](https://github.com/megahertz/electron-log)
    and stored at `{appData}/log.log` (see [here](https://github.com/electron/electron/blob/master/docs/api/app.md#appgetpathname)
    to find information about `appData`).

Please provide more context by answering these questions:

* **Did the problem start happening recently** (e.g. after updating to a new
    version of FreeMAN) or was this always a problem?
* If the problem started happening recently, **can you reproduce the problem in
    an older version of FreeMAN?** What's the most recent version in which the
    problem doesn't happen? You can download older versions of FreeMAN from [the
    releases page](https://github.com/matthew-matvei/freeman/releases).
* **Can you reliably reproduce the issue?** If not, provide details about how
    often the problem happens and under which conditions it normally happens.
* If the problem is related to working with files (e.g. opening and editing
    files), **does the problem happen for all files and projects or only
    some?** Does the problem happen only when working with local or remote
    files (e.g. on network drives), or with large files? Is there anything else
    special about the files you are using?

Include details about your configuration and environment:

* **Which version of FreeMAN are you using?** You can get the exact version by
    running `freeman --version|-v` in your terminal, or by starting FreeMAN and
    opening *Help -> About*.
* **What's the name and version of the OS you're using**?
* **Are you using custom configuration files** `freeman.settings.json`,
    `freeman.keys.json`, `freeman.themes/*.json`? If so, provide the contents
    of those files, preferably in a [code block](https://help.github.com/articles/markdown-basics/#multiple-lines)
    or with a link to a [gist](https://gist.github.com/).
* **Which keyboard layout are you using?** Are you using a US layout or some
    other layout?

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for FreeMAN,
including completely new features and minor improvements to existing
functionality. Following these guidelines helps us understand your suggestion.

Before creating enhancement suggestions, please check [this list](#before-submitting-an-enhancement-suggestion)
as you might find out that you don't need to create one. When you are creating
an enhancement suggestion, please [include as many details as possible](#how-do-i-submit-a-good-enhancement-suggestion).
Fill in [the template](ISSUE_TEMPLATE.md), including the steps that you imagine
you would take if the feature you're requesting existed.

#### Before Submitting An Enhancement Suggestion

* **Perform a cursory search** to see if the enhancement has already been
    suggested. If it has, add a comment to the existing issue instead of
    opening a new one.

#### Submitting A Good Enhancement Suggestion

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/).
Create an issue and provide the following information:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include
    copy/pasteable snippets which you use in those examples, as [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the current behavior** and **explain which behavior you expected
    to see instead** and why.
* **Include screenshots and animated GIFs** which help you demonstrate the
    steps or point out the part of FreeMAN which the suggestion is related to. You
    can use [this tool](https://www.cockos.com/licecap/) to record GIFs on
    macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast)
    or [this tool](https://github.com/GNOME/byzanz) on Linux.
* **List some other file managers or applications where this enhancement exists.**

### Your First Code Contribution

Unsure where to begin contributing to FreeMAN? You can start by looking through
any `first timer friendly` issues. That being said, other issues may be well
worth the venture, and I'm receptive and supportive of any contributions and
questions supporting those contributions.

#### Local development

FreeMAN can be developed locally. For instructions on how to do this, see the
[README](../README.md).

### Pull Requests

* Fill in [the required template](PULL_REQUEST_TEMPLATE.md)
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever appropriate.
* I'm not interested in flaky stylistic preferences for code. If it passes
    `npm run lint` and I don't like it, I may update linting rules after the PR.
* Include thoughtfully-worded, well-structured [Mocha](https://mochajs.org/)
    tests in the `test` folder. Run them using `npm run test`.
* Document new code based on the [Documentation Styleguide](#documentation-styleguide)
* End all files with a newline
* Avoid platform-dependent code
* Place imports in the following ordered groups (`npm run lint` will order the groups themselves):
    * Modules from `node_modules`
    * Local Modules

## Styleguides

### Git Commit Messages

* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* When only changing documentation, include `[ci skip]` in the commit title

### Documentation Styleguide

* Some manual checking is unfortunately still required, since `@inheritDocs` is
    poorly supported in `tslint`. All elements other than local variables (i.e.,
    `const`, `var` and `let` variables) must be JSDoc documented
* Avoid one-line comments in favour of clearer code (meaningful names, smaller
    methods, logical flow etc.)
