import {
    NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import ConnectWallet from './ConnectWallet/ConnectWallet';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface TopNavProps {
    onLimitedGfx?: () => void;
    limitedGfx?: boolean;
}

export function TopNav({ onLimitedGfx, limitedGfx }: TopNavProps) {
    return (
        <NavigationMenu className='flex flex-row justify-end ml-auto' delayDuration={0}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} href='/'>
                        Create Token
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <ConnectWallet />
                <NavigationMenuItem>
                    <div className="flex items-center space-x-2">
                        <Switch id="limited-gfx" onCheckedChange={onLimitedGfx} checked={!limitedGfx} />
                        <Label htmlFor="limited-gfx" className='cursor-pointer'>Effects {limitedGfx ? 'Off' : 'On'}</Label>
                    </div>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

export function Logo() {
    return (
        <h1 className='display-5 my-12'><span className='title-orange-text'>Stacks</span> <strong className='title-blue-text'>Token Factory</strong></h1>
    );
}
