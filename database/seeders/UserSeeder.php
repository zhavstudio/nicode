<?php

namespace Database\Seeders;

use App\Models\User;


use Carbon\Carbon;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $items = [
            [

                'first_name' => "Landa Trip",
                'last_name' => "admin",
                'phone_number'  => "09331210757",
                'email' => "manager@landatrip.com",
                'email_verified_at' => Carbon::Now(),
                "password" => bcrypt("landatripadmin"),
                'gender' => 0,
                'role'   => "admin"

            ],
            [

                'first_name' => "علی",
                'last_name' => "مجرد",
                'phone_number'  => "09138936589",
                'email' => "manager@landatrip.com",
                'email_verified_at' => Carbon::Now(),
                "password" => bcrypt("landatripadmin"),
                'gender' => 0,
                'role'   => "admin"

            ],
            [
                'first_name' => "Iman",
                'last_name' => "Nasr Esfahani",
                'phone_number'  => "09131287005",
                'email' => "iman.nasr.esfahan@gmail.com",
                'email_verified_at' => Carbon::Now(),
                "password" => bcrypt("landatriptest123"),
                'gender' => 1,
                'role'   => "user"

            ],
            [
                'first_name' => "admin1",
                'last_name' => "admin1",
                'phone_number'  => "09359951286",
                'email' => "admin1.landatrip@gmail.com",
                'email_verified_at' => Carbon::Now(),
                "password" => bcrypt("landatriptest123"),
                'gender' => 2,
                'role'   => "admin"

            ],
            [
                'first_name' => "admin2",
                'last_name' => "admin2",
                'phone_number'  => "09133264361",
                'email' => "admin2.landatrip@gmail.com",
                'email_verified_at' => Carbon::Now(),
                "password" => bcrypt("landatriptest123"),
                'gender' => 1,
                'role'   => "user"

            ],
            [
                'first_name' => "sara",
                'last_name' => "esmaili",
                'phone_number'  => "09131104122",
                'email' => "sara.test@gmail.com",
                'email_verified_at' => Carbon::Now(),
                "password" => bcrypt("landatriptest123"),
                'gender' => 0,
                'role'   => "admin"
            ],
        ];

        foreach ($items as $item) {

            $userObj = new User($item);
                $userObj->withoutEvents(function () use ($userObj) {
                    unset($userObj["role"]);
                    $userObj->id = $userObj->newUniqueId();
                    $userObj->save();
                });
                $userObj->addRole($item["role"]);
        }
    }
}
