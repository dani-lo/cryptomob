import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '../src/utils/reactqueryClient'

import { TasksComponent } from '../components/Tasks'

import { HeaderComponent } from '../components/header'

export default function Page() {

    return <QueryClientProvider client={queryClient}>
        <div>
            <HeaderComponent />
            <div>Todo App</div>
            <TasksComponent />
        </div>
    </QueryClientProvider>
}



{/* </div>
<script>function selected() {
var targeted = event.target;
var clicked = targeted.parentElement;

var child = clicked.children;
console.log(child);

for (let i = 0; i < child.length; i++) {
if (child[i].classNameList.contains("text-white")) {
console.log(child[i]);
child[i].classNameList.remove("text-white", "bg-indigo-600");
child[i].classNameList.add(
"text-gray-600",
"bg-gray-50",
"border",
"border-white"
);
}
}

targeted.classNameList.remove(
"text-gray-600",
"bg-gray-50",
"border",
"border-white"
);
targeted.classNameList.add("text-white", "bg-indigo-600");
}

function selectNew() {
var newL = document.getElementById("list");
newL.classNameList.toggle("hidden");

document.getElementById("ArrowSVG").classNameList.toggle("rotate-180");
}

function selectedSmall() {
var text = event.target.innerText;
var newL = document.getElementById("list");
var newText = document.getElementById("textClicked");
newL.classNameList.add("hidden");
document.getElementById("ArrowSVG").classNameList.toggle("rotate-180");
newText.innerText = text;

document.getElementById("s1").classNameList.remove("hidden");
}
</script> */}
   
