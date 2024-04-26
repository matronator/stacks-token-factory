import {
    NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Link } from '@radix-ui/react-navigation-menu';
import ConnectWallet from './ConnectWallet';

export function Header() {
    return (
        <NavigationMenu className='ml-auto flex flex-row justify-end'>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link href="/">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Create Token
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <ConnectWallet />
            </NavigationMenuList>
        </NavigationMenu>
    );
}
