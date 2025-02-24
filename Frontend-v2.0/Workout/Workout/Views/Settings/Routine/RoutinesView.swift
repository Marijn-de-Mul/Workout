import SwiftUI

struct RoutinesView: View {
    var body: some View {
        List {
            Section {
                NavigationLink(destination: AddRoutineCategoryView()) {
                    Label("Add Routine Category", systemImage: "plus.circle")
                }
                NavigationLink(destination: AddRoutineView()) {
                    Label("Add Routine", systemImage: "plus.circle")
                }
                NavigationLink(destination: ManageRoutinesView()) {
                    Label("Manage Routines", systemImage: "list.bullet")
                }
            }
        }
        .navigationTitle("Routines")
    }
}
