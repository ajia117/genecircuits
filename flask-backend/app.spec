# -*- mode: python ; coding: utf-8 -*-
import sys
block_cipher = None

a = Analysis(
    ['app.py', 'simulate.py'],
    pathex=[],
    binaries=[],
    datas=[
    ],
    hiddenimports=['IPython', 'IPython.display', 'unicodedata'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)
pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='app',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    # For a GUI application change to False for Windows (hides console)
    console=False if sys.platform == 'win32' else True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)