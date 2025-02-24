import SwiftUI

struct AddRoutineCategoryView: View {
    @State private var categoryName: String = ""
    @State private var categoryDesc: String = ""
    @State private var categories: [Category] = []
    @State private var errorMessage: String?

    var body: some View {
        VStack(spacing: 20) {
            TextField("Category Name", text: $categoryName)
                .padding()
                .textFieldStyle(RoundedBorderTextFieldStyle())

            TextField("Category Description", text: $categoryDesc)
                .padding()
                .textFieldStyle(RoundedBorderTextFieldStyle())

            Button(action: addCategory) {
                Text("Add Category")
                    .font(.headline)
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.blue)
                    .cornerRadius(10)
            }
            .padding(.horizontal)

            if let errorMessage = errorMessage {
                Text(errorMessage)
                    .foregroundColor(.red)
            }

            List {
                ForEach(categories) { category in
                    HStack {
                        Text(category.name)
                        Spacer()
                        Button(action: {
                            deleteCategory(category)
                        }) {
                            Image(systemName: "trash")
                                .foregroundColor(.red)
                        }
                    }
                }
            }
        }
        .navigationTitle("Add Routine Category")
        .padding()
        .background(Color(.systemGroupedBackground))
        .onAppear(perform: fetchCategories)
    }

    private func addCategory() {
        NetworkManager.shared.addCategory(categoryName, desc: categoryDesc, type: "Routine") { result in
            switch result {
            case .success(let category):
                print("Category added: \(category)")
                fetchCategories()
            case .failure(let error):
                DispatchQueue.main.async {
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }

    private func fetchCategories() {
        NetworkManager.shared.fetchCategories { result in
            switch result {
            case .success(let categories):
                DispatchQueue.main.async {
                    self.categories = categories.filter { $0.type == "Routine" }
                }
            case .failure(let error):
                DispatchQueue.main.async {
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }

    private func deleteCategory(_ category: Category) {
        NetworkManager.shared.deleteCategory(category.id) { result in
            switch result {
            case .success:
                DispatchQueue.main.async {
                    self.categories.removeAll { $0.id == category.id }
                }
            case .failure(let error):
                DispatchQueue.main.async {
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }
}

struct AddCategoryRoutineSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @State private var categoryName: String = ""
    @State private var categoryDesc: String = ""
    @State private var errorMessage: String?

    var onSave: (Category) -> Void

    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Category Name")) {
                    TextField("Enter category name", text: $categoryName)
                }
                Section(header: Text("Category Description")) {
                    TextField("Enter category description", text: $categoryDesc)
                }
                if let errorMessage = errorMessage {
                    Text(errorMessage)
                        .foregroundColor(.red)
                }
            }
            .dismissKeyboardOnTap()
            .navigationBarTitle("Add Category", displayMode: .inline)
            .navigationBarItems(leading: Button("Cancel") {
                presentationMode.wrappedValue.dismiss()
            }, trailing: Button("Save") {
                if categoryName.isEmpty {
                    errorMessage = "Category name cannot be empty"
                } else {
                    NetworkManager.shared.addCategory(categoryName, desc: categoryDesc, type: "Routine") { result in
                        switch result {
                        case .success(let category):
                            onSave(category)
                            presentationMode.wrappedValue.dismiss()
                        case .failure(let error):
                            errorMessage = error.localizedDescription
                        }
                    }
                }
            })
        }
    }
}
