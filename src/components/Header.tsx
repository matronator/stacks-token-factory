import {
    NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Link } from '@radix-ui/react-navigation-menu';
import ConnectWallet from './ConnectWallet/ConnectWallet';

export function Header() {
    return (
        <NavigationMenu className='flex flex-row justify-end ml-auto'>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} href='/'>
                        Create Token
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <ConnectWallet />
            </NavigationMenuList>
        </NavigationMenu>
    );
}
