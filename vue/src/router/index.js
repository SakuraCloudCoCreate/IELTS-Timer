import { createWebHashHistory, createRouter } from 'vue-router';
import FrameVue from "@/components/FrameView.vue";
import NotFoundView from "@/components/NotFoundView.vue";
import {ElMessage, ElMessageBox} from "element-plus";
import launchRocket from "@/utils/launchRocket.js";

const routes = [
    {
        path: '/',
        component: () => import("@/components/pages/Home.vue") // 包裹在函数中
    },
    {
        name: 'home',
        path: '/home',
        component: () => import("@/components/pages/Home.vue") // 包裹在函数中
    },
    {
        path: '/practice',
        component: FrameVue,
        children: [
            {
                name: 'practice-reading',
                path: 'reading',
                component: () => import("@/components/pages/practice/Reading.vue") // 包裹在函数中
            },
            {
                name: 'practice-writing',
                path: 'writing',
                component: ()=> import("@/components/pages/practice/Writing.vue")
            },
            {
                path: '',
                component: NotFoundView
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: NotFoundView
    }
];

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL), // 使用 createWebHistory
    routes,
});

router.beforeEach((to, from, next) => {
    if (from.name==="practice-reading"){
        if (launchRocket().status === 2 || launchRocket().status === 1){
            ElMessageBox.confirm(
                'You have a timer started. Moving to other pages will cancel this timer. Do yo agree',
                'Warning',
                {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Reject',
                    type: 'warning',
                }
            )
                .then(() => {
                    localStorage.setItem("readingTimerStarted",null)
                    launchRocket().stop()
                    window.electron.electronTimerStop()
                    next(true)

                })
                .catch(() => {
                    ElMessage({
                        type: 'info',
                        message: 'Rejected',
                    })
                    next(false)


                })
        }else {
            next(true)
        }
    }else{
        next(true)
    }


})


export default router;
