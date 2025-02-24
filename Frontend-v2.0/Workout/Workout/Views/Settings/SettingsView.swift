import SwiftUI

struct SettingsView: View {
    @Binding var isLoggedIn: Bool
    
    var body: some View {
        NavigationView {
            List {
                Section(header: Text("Account")) {
                    NavigationLink(destination: AccountView(isLoggedIn: $isLoggedIn)) {
                        HStack {
                            Image(systemName: "person.circle")
                                .foregroundColor(.blue)
                            Text("Account")
                                .font(.headline)
                                .padding()
                        }
                    }
                }

                Section(header: Text("Preferences")) {
                    NavigationLink(destination: RoutinesView()) {
                        HStack {
                            Image(systemName: "list.bullet.circle")
                                .foregroundColor(.blue)
                            Text("Routines")
                        }
                    }
                    NavigationLink(destination: ExercisesView()) {
                        HStack {
                            Image(systemName: "figure.walk.circle")
                                .foregroundColor(.blue)
                            Text("Exercises")
                        }
                    }
                }

                Section(header: Text("Future Features")) {
                    HStack {
                        Image(systemName: "gearshape.circle")
                            .foregroundColor(.gray)
                        Text("Advanced Settings")
                            .foregroundColor(.gray)
                    }
                    .disabled(true)
                    HStack {
                        Image(systemName: "cloud.circle")
                            .foregroundColor(.gray)
                        Text("Cloud Sync")
                            .foregroundColor(.gray)
                    }
                    .disabled(true)
                    HStack {
                        Image(systemName: "lock.circle")
                            .foregroundColor(.gray)
                        Text("Security")
                            .foregroundColor(.gray)
                    }
                    .disabled(true)
                }
            }
            .listStyle(InsetGroupedListStyle())
            .navigationTitle("Settings")
        }
    }
}
