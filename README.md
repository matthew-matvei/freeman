# FreeMAN

A free, extensible, cross-platform file manager for power users

---

## Roadmap

* Application suitable for development only
* Core application ready for beta use
* Out-of-the-box plugins ready for beta use
* Core application ready for production use
* Out-of-the-box plugins ready for production use

The application is currently only suitable for development only.

## Getting started

Some settings files currently need to be manually copied, work is in the
backlog to automate this process to help speed up development. `{userData}` and `{appData}` below refer to Electron's `app.getPath("userData")` and
`app.getPath("appData")` locations respectively.

    $ mkdir {appData}/FreeMAN
    $ cp -r resources/*.json {appData}/FreeMAN

You can add a user-specific `keys.json` like so

    $ mkdir {userData}/FreeMAN
    $ cp keys.json {userData}/FreeMAN

Ideally, after cloning, you can just:

    npm install
    npm start

One complex dependency is `node-pty`. If you have any problems building
it, see its [issues page](https://github.com/Tyriar/node-pty/issues).

## Can I contribute?

Yes please! Work on the core application is still under way. There are
numerous areas with room for improvement in usability and stability. My
priorities for development are currently:

* Core functionality
* Plugin functionality (starting with out-of-the-box ones)
* Appearance

I'll take whatever pull requests, issues, contributors and PMs I can get!
