# Arcanoid-MVP
A minimum viable version of a game application with the "Arcanoid" mechanic.

---
> **Legal Notice**: Copyright (c) 2026 Aleksei Gara. All rights reserved.  
> This source code is provided for **review purposes only**. Unauthorized copying, modification, or distribution is strictly prohibited.
---

<p align="center">
   <a href="https://alexeygara.github.io/Arcanoid-MVP/">
   <img src="./screenshots/menu_screenshot.png" width="800" title="Blast-Game Gameplay Preview">
</p>

## Licensing Information

### Source Code
The source code of this project is **UNLICENSED**. All rights reserved.
This code is provided for educational and review purposes only. No part of this
source code may be copied, modified, or redistributed without explicit written
permission from the author.

### Assets (Graphics, Fonts)
The visual assets contained in this project (e.g., in the `/public/assets` directory)
are the property of their respective owners and are used here under __*Personal License / Limited Use License*__.

**Note on Assets:** All this visual assets are proprietary and were used with the owner's verbal permission for this technical assessment.

**The author of this repository does not claim ownership of these assets.**
Usage rights for these materials must be obtained from the original creators.

---

## ⚙️ State Machine Architecture

### State Transition Flow

### `State Machine`

*   **`init()`**
    *   Initialize the initial **State** (skips validation checks).
    *   ↳ **`create(first_state_id)`**
    *   ↳ **`ENTER()`** initial **State**
    *   ↳ **`START()`** initial **State**

*   **`destroy()`**
    *   Terminate the active **State** without transitioning to a new one.
    *   ↳ **`STOP()`** current **State**
    *   ↳ **`EXIT()`** current **State**

*   **`HANDLE(event)`**
    *   Resolve a **valid transition** based on the event.
    *   Evaluate if the current transition is interruptible: **interrupt** or **block** as needed.
    *   Execute **`guard?.()`** condition check.
    *   Trigger transition **`action?.()`**.
    *   📦 **Transition Block:**
        1.  **`STOP()`** current **State**
        2.  **`create(new_state_id)`**
            *   Instantiate all **Modules**:
                *   `Module[N]` initialization:
                    *   Create **Control**, **Model**, and **View**.
                    *   Initialize **AnimationManager**.
        3.  **`ENTER()`** new **State**
        4.  **`EXIT()`** current **State**
        5.  **`START()`** new **State**

### `State`

*   **`STOP()`**
    *   Deactivate all **Modules**.
    *   ↳ **`deactivate()`** → `Module[N]`

*   **`EXIT()`**
    *   Execute exit logic for all **Modules**:
        *   ↳ **`doExit()`** → `Module[N]`
    *   Detach all **Modules** from the **Scene**:
        *   ↳ **`detach(scene)`** → `Module[N]`
    *   Dispose of all **Modules**:
        *   ↳ **`destroy()`** → `Module[N]`
    *   Hide and destroy/cache the current **Scene**:
        *   ↳ **`hide(scene)`** via `SceneManager`:
            *   Disable all **Scene** inputs.
            *   Unsubscribe **Scene** from `ResizeManager` events.
            *   Remove **Scene** from the **Root-node**.
            *   Handle **Scene** disposal or caching:
                *   **If (destroy):** **`doDestroy()`** the **Scene** (clear layer structure).
                *   **If (destroy) & (not_shared_res):** **`doUnload()`** resources via `AssetsManager`.

*   **`ENTER()`**
    *   Initialize/restore and display the new **Scene**:
        *   ↳ **`show(scene)`** via `SceneManager`:
            *   Restore from cache or instantiate new **Scene**.
            *   **If (new):** **`doPreload()`** (if not preloaded at boot) via `AssetsManager`.
            *   **If (new):** **`doCreate()`** (build layer structure).
            *   Attach **Scene** to the **Root-node**.
            *   Subscribe **Scene** to `ResizeManager` events.
    *   Attach all **Modules** to the **Scene**:
        *   ↳ **`attach(scene)`** → `Module[N]`
    *   Execute entry logic for all **Modules**:
        *   ↳ **`doEnter()`** → `Module[N]`

*   **`START()`**
    *   Activate all **Modules**.
    *   ↳ **`activate()`** → `Module[N]`

### `Module`

*   **`attach(scene)`**
    *   Build the **View** node hierarchy.
    *   ↳ **`add(view)`** to the **Scene**.
    *   Subscribe **View** to `ResizeManager` events.
    *   Register **updatables** via **`addToGameLoop()`** on the **Scene**.
    *   Execute **`onAttached?.()`** callback on the **View**.

*   **`doEnter()`**
    *   Apply **payload data** and perform module pre-activation.
    *   Trigger and await completion of the **Fade-In** sequence.

*   **`activate()`**
    *   Enable module logic: controls, inputs, animations, etc.
    *   ↳ **`start()`** the **Control** component.

*   **`deactivate()`**
    *   Disable module logic: controls, inputs, animations, etc.
    *   ↳ **`stop()`** the **Control** component.

*   **`doExit()`**
    *   Trigger and await completion of the **Fade-Out** sequence.

*   **`detach(scene)`**
    *   Unregister **updatables** via **`removeFromGameLoop()`** from the **Scene**.
    *   Unsubscribe **View** from `ResizeManager` events.
    *   ↳ **`remove(view)`** from the **Scene**.
    *   Execute **`onDetached?.()`** callback on the **View**.

*   **`destroy()`**
    *   Dispose of the **Control** component.
    *   Dispose of the **View** component (clears child nodes and releases **Textures**).
    *   Dispose of the **Model** component.

