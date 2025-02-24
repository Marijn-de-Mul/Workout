import SwiftUI

struct ContentView: View {
    @State private var isLoggedIn: Bool = false

    var body: some View {
        Group {
            if isLoggedIn {
                MainTabView(isLoggedIn: $isLoggedIn)
            } else {
                LoginView(isLoggedIn: $isLoggedIn)
            }
        }
        .onAppear {
            UserManager.shared.checkTokenValidity { isValid in
                DispatchQueue.main.async {
                    self.isLoggedIn = isValid
                }
            }
        }
    }
}

struct MainTabView: View {
    @Binding var isLoggedIn: Bool
    @State private var showInfo = false
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            RoutineView()
                .tabItem {
                    Image(systemName: "list.bullet")
                    Text("Routines")
                }
                .tag(0)
            ExerciseView()
                .tabItem {
                    Image(systemName: "figure.walk")
                    Text("Exercises")
                }
                .tag(1)
            SettingsView(isLoggedIn: $isLoggedIn)
                .tabItem {
                    Image(systemName: "gearshape.fill")
                    Text("Settings")
                }
                .tag(2)
            Text("")
                .tabItem {
                    Image(systemName: "info.circle")
                    Text("Info")
                }
                .tag(3)
                .onAppear {
                    showInfo = true
                }
        }
        .sheet(isPresented: $showInfo, onDismiss: {
            selectedTab = 0 
        }) {
            InfoView()
        }
    }
}

#Preview {
    ContentView()
}
