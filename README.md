<div align="center">

# ![logo](https://raw.githubusercontent.com/RodrigoDornelles/pwa-chrfonts/main/assets/icon-192.png) <br/> PWA CHR FONTS EDITOR

[![sponsors](https://img.shields.io/github/sponsors/rodrigodornelles?color=ff69b4&logo=github)](https://github.com/sponsors/RodrigoDornelles)
[![version](https://img.shields.io/github/v/release/rodrigodornelles/pwa-chrfonts?filter=*&logo=github)](https://github.com/RodrigoDornelles/pwa-chrfonts/releases)
[![build](https://img.shields.io/github/actions/workflow/status/rodrigodornelles/pwa-chrfonts/pages.yml?label=deploy&logo=github)](https://github.com/RodrigoDornelles/pwa-chrfonts/actions/workflows/pages.yml)
[![check](https://img.shields.io/github/actions/workflow/status/rodrigodornelles/pwa-chrfonts/check.yml?label=check&logo=github)](https://github.com/RodrigoDornelles/pwa-chrfonts/actions/workflows/check.yml)
[![license](https://img.shields.io/github/license/rodrigodornelles/pwa-chrfonts?logo=gnu
)](https://github.com/RodrigoDornelles/pwa-chrfonts/blob/develop/LICENSE)

</div>

> **run in your browser!** thats a editor utility to change your fonts sprites in tilesets and homebrews/rackrom games.

## :joystick: Platforms

 * [X] [Nintendo Entertainment System](https://www.nesdev.org/wiki)
 * [ ] Nintendo Gameboy
 * [ ] Nintendo Gameboy Color
 * [ ] Sega Mastersystem
 * [ ] Sega Megadrive

## :floppy_disk: Features

 * [X] Preview tileset online in your browser
 * [X] Support multiples chr banks
 * [X] Insert new fonts from system
 * [ ] Insert new fonts from default _(compatibility with browsers not then edge or chrome)_
 * [ ] Insert new fonts from cdn _([googlefonts](https://fonts.google.com/), [jsdelivry](https://jsdelivr.com))_
 * [ ] Insert new fonts from zip url _([fontmeme](https://fontmeme.com/), [dafont](dafont.com))_
 * [X] Export as pdf, tileset, image or rom.

## :memo: Tutorial

<div align="center">

### View

| ![ver02](https://raw.githubusercontent.com/RodrigoDornelles/RodrigoDornelles/master/media/pwa-chr-02-a-min.gif) | ![ver02](https://raw.githubusercontent.com/RodrigoDornelles/RodrigoDornelles/master/media/pwa-chr-02-b-min.gif) |
| :-: | :-: |
| **1-** choose the rom file | **2-** choose the preview page , color and grid. |

### Edit

| ![ver02](https://raw.githubusercontent.com/RodrigoDornelles/RodrigoDornelles/master/media/pwa-chr-02-c-min.gif) | ![ver02](https://raw.githubusercontent.com/RodrigoDornelles/RodrigoDornelles/master/media/pwa-chr-02-d-min.gif) | 
| :-: | :-: |
| **3-** configure the unicode | **4-** configure the font |

| ![ver02](https://raw.githubusercontent.com/RodrigoDornelles/RodrigoDornelles/master/media/pwa-chr-02-e-min.gif) |
| :-: |
| **5-** customize the weight |

### Export

| ![ver03](https://raw.githubusercontent.com/RodrigoDornelles/RodrigoDornelles/master/media/pwa-chr-03-a-min.gif) | ![ver03](https://raw.githubusercontent.com/RodrigoDornelles/RodrigoDornelles/master/media/pwa-chr-03-b-min.gif) |
| :-: | :-: |
| **6-** save modified game | **7-** test in emulator! |

</div>

## :wrench: Contribute  ##

This is a very simple project to improve it, you just need to know **typescript** and and it has __no dependencies__ for production, just use webpack as a bundler in development.

### Install

#### NodeJS

```bash
git clone https://github.com/RodrigoDornelles/pwa-chrfonts
npm install
```

#### Docker

```bash
git clone https://github.com/RodrigoDornelles/pwa-chrfonts
docker run --rm -v $(pwd):/app -w /app  -it node npm install
```

### Build

#### NodeJS

```bash
npm run build
```

#### Docker

```bash
docker run --rm -v $(pwd):/app -w /app  -it node npm run build
```

------------------------------------------------------------------------------------------------------
![logo](https://raw.githubusercontent.com/RodrigoDornelles/pwa-chrfonts/main/assets/icon-24.png)
This project is licensed under **GNU AGPL 3.0 or higher**, please read the [LICENSE](LICENSE) file.
