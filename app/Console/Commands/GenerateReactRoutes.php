<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateReactRoutes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:react-routes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->warn('User Panel React Routes generating started...');
        $this->call('generate:react-user-panel-routes');

        $this->warn('Admin Panel React Routes generating started...');
        $this->call('generate:react-admin-panel-routes');
    }
}
