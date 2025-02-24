import SwiftUI

struct ExercisesView: View {
    var body: some View {
        List {
            Section {
                NavigationLink(destination: AddExerciseCategoryView()) {
                    Label("Add Exercise Category", systemImage: "plus.circle")
                }
                NavigationLink(destination: AddExerciseView()) {
                    Label("Add Exercise", systemImage: "plus.circle")
                }
                NavigationLink(destination: ManageExercisesView()) {
                    Label("Manage Exercises", systemImage: "list.bullet")
                }
            }
        }
        .navigationTitle("Exercises")
        .listStyle(InsetGroupedListStyle())
    }
}
