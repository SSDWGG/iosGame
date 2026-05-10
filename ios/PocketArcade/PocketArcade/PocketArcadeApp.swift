import SwiftUI

@main
struct PocketArcadeApp: App {
    var body: some Scene {
        WindowGroup {
            GameWebView()
                .ignoresSafeArea()
                .background(Color(red: 0.067, green: 0.067, blue: 0.086))
                .statusBarHidden(true)
        }
    }
}
