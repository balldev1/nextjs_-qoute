import { TableCard } from "@/components/dashboard/table_card";
import {DashboardCard} from "@/components/dashboard/dashboard_card";

export default function Home() {

    return (
        <div className="p-5 h-full">
            <div className="h-full">
                <div className="space-y-5">
                    <DashboardCard/>
                </div>
            </div>
        </div>
    );
}
