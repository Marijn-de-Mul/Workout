import SwiftUI

struct RoutineView: View {
    @State private var routines: [Routine] = []
    @State private var errorMessage: String?
    @State private var showSettings = false
    @State private var timer: Timer?

    var body: some View {
        NavigationView {
            VStack {
                if let errorMessage = errorMessage {
                    Text(errorMessage)
                        .foregroundColor(.red)
                } else if routines.isEmpty {
                    VStack(spacing: 20) {
                        Text("No routines available")
                            .font(.headline)
                        Text("You haven't created any routines yet. Go to settings to create your first routine.")
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                        Button(action: {
                            showSettings = true
                        }) {
                            Text("Go to Settings")
                                .font(.headline)
                                .foregroundColor(.white)
                                .padding()
                                .background(Color.blue)
                                .cornerRadius(10)
                        }
                    }
                } else {
                    List(routines) { routine in
                        NavigationLink(destination: RoutineDetailView(routine: routine)) {
                            Text(routine.name)
                        }
                    }
                }
            }
            .navigationBarItems(trailing: Button(action: {
                showSettings = true
            }) {
                Text("Edit")
            })
            .sheet(isPresented: $showSettings) {
                SettingsView(isLoggedIn: .constant(true))
            }
            .onAppear {
                startTimer()
            }
            .onDisappear {
                stopTimer()
            }
            .padding()
            .navigationTitle("Routines")
        }
    }

    private func startTimer() {
        getRoutines()
        timer = Timer.scheduledTimer(withTimeInterval: 30.0, repeats: true) { _ in
            getRoutines()
        }
    }

    private func stopTimer() {
        timer?.invalidate()
        timer = nil
    }

    private func getRoutines() {
        NetworkManager.shared.getRoutines { result in
            switch result {
            case .success(let routines):
                DispatchQueue.main.async {
                    self.routines = routines
                }
            case .failure(let error):
                DispatchQueue.main.async {
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }
}
